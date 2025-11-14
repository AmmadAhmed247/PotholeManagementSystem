import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { userTree } from '../services/userTree.js';


export const initializeUserTree = async () => {
  try {
    const users = await User.find({});
    users.forEach(user => {
      userTree.insert(user.email, {
        id: user._id,
        email: user.email,
        password: user.password,
        role: user.role,
        name: user.name
      });
    });
    console.log(`User tree initialized with ${users.length} users`);
  } catch (error) {
    console.error('Error initializing user tree:', error);
  }
};

export const signup = async (req, res) => {
  try {
    const { name, cnic, mobile, email, password, role } = req.body;
    
    // Check tree first (faster than DB query)
    const existingInTree = userTree.search(email);
    if (existingInTree) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Double-check in database (in case tree is out of sync)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      cnic,
      mobile,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await newUser.save();
    
    // Insert into tree for fast future lookups
    userTree.insert(email, {
      id: newUser._id,
      email,
      password: hashedPassword,
      role: newUser.role,
      name
    });
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Search tree first (O(log n) vs O(n) database query)
    let userData = userTree.search(email);
    
    let user;
    
    if (userData) {
      // User found in tree - use cached data
      user = {
        _id: userData.id,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: userData.role
      };
    } else {
      // User not in tree - fetch from database
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      // Add to tree for future fast lookups
      userTree.insert(email, {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password
      });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Extended from 1h
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};