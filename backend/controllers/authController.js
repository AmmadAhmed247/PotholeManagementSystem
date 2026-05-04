import oracledb from 'oracledb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { withConnection } from '../services/Db.js';
import { userTree } from '../services/userTree.js';


const sanitizeUser = (row) => {
  if (!row) return null;
  return {
    id:       row.ID ? String(row.ID) : null,
    name:     row.NAME || '',
    email:    row.EMAIL || '',
    password: row.PASSWORD || '',
    role:     row.ROLE || 'user',
    cnic:     row.CNIC || '',
    mobile:   row.MOBILE || ''
  };
};


export const initializeUserTree = async () => {
  try {
    const result = await withConnection((conn) =>
      conn.execute(`SELECT RAWTOHEX(id) AS id, name, email, password, role, cnic, mobile FROM users`)
    );
    
    if (result.rows) {
      result.rows.forEach((row) => {
        const cleanUser = sanitizeUser(row);
        userTree.insert(cleanUser.email, cleanUser);
      });
      console.log(`User tree initialized with ${result.rows.length} users`);
    }
  } catch (error) {
    console.error('Error initializing user tree:', error.message);
  }
};

export const signup = async (req, res) => {
  try {
    const { name, cnic, mobile, email, password, role } = req.body;

    // 1. Check tree first (O(log n))
    if (userTree.search(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Double-check DB
    const existing = await withConnection((conn) =>
      conn.execute(`SELECT id FROM users WHERE email = :email`, { email })
    );

    if (existing.rows && existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert into Oracle
    const result = await withConnection((conn) =>
      conn.execute(
        `INSERT INTO users (name, cnic, mobile, email, password, role)
         VALUES (:name, :cnic, :mobile, :email, :password, :role)
         RETURNING RAWTOHEX(id) INTO :id`,
        {
          name,
          cnic,
          mobile,
          email,
          password: hashedPassword,
          role: role || 'user',
          id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        },
        { autoCommit: true }
      )
    );

    const newId = result.outBinds.id[0];

    // 5. Update local Tree for future fast lookups
    userTree.insert(email, {
      id: String(newId),
      email,
      password: hashedPassword,
      role: role || 'user',
      name,
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check Tree first
    let userData = userTree.search(email);
    let user;

    if (userData) {
      // Data in tree is already sanitized
      user = userData;
    } else {
      // 2. Fallback to DB
      const result = await withConnection((conn) =>
        conn.execute(
          `SELECT RAWTOHEX(id) AS id, name, email, password, role, cnic, mobile
           FROM users WHERE email = :email`,
          { email }
        )
      );

      if (!result.rows || result.rows.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }

      // 3. Sanitize and store in tree
      user = sanitizeUser(result.rows[0]);
      userTree.insert(email, user);
    }

    // 4. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    // 5. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. Return Clean Object (No circular refs)
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role, 
        email: user.email 
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};