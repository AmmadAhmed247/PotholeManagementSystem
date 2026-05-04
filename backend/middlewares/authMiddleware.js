import jwt from 'jsonwebtoken';
import { withConnection } from '../services/Db.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT RAWTOHEX(id) AS id, name, email, mobile, role
         FROM users WHERE id = HEXTORAW(:id)`,
        { id: decoded.id }
      )
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: 'Unauthorized' });

    const row = result.rows[0];
    req.user = {
      id:     row.ID,
      name:   row.NAME,
      email:  row.EMAIL,
      mobile: row.MOBILE,
      role:   row.ROLE,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};