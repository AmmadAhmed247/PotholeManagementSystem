import oracledb from 'oracledb';
import { withConnection } from '../services/Db.js';
import { complaintsList } from '../services/dllComplaints.js';
import { leaderboard } from './leaderboard.controller.js';

/**
 * HELPER: sanitizeRow
 * This is the "Magic Bullet". By destructuring the row directly in the arguments
 * and returning a fresh literal, we ensure NO hidden Oracle driver properties 
 * follow the data into the JSON response.
 */
const sanitizeRow = (row) => {
  if (!row) return null;
  
  // Destructure to extract ONLY the data values we need
  const { 
    ID, TITLE, DESCRIPTION, LOCATION, AREA, 
    STATUS, CREATED_AT, UPDATED_AT, 
    NAME, EMAIL, MOBILE 
  } = row;

  return {
    id:          ID ? String(ID) : null,
    title:       TITLE || '',
    description: DESCRIPTION || '',
    location:    LOCATION || '',
    area:        AREA || '',
    status:      STATUS || '',
    createdAt:   CREATED_AT || null,
    updatedAt:   UPDATED_AT || null,
    user: {
      name:   NAME || '',
      email:  EMAIL || '',
      mobile: MOBILE || '',
    }
  };
};

export const getAllComplaintsStatus = async (req, res) => {
  try {
    const result = await withConnection(async (conn) => {
      return await conn.execute(
        `SELECT RAWTOHEX(c.id) AS id,
                c.title, c.description, c.location,
                c.status, c.created_at, c.updated_at,
                u.name, u.email, u.mobile
         FROM complaints c
         JOIN users u ON u.id = c.user_id
         ORDER BY c.created_at DESC`
      );
    });

    const formatted = (result.rows || []).map(row => sanitizeRow(row));
    return res.status(200).json({ complaints: formatted });
  } catch (err) {
    console.error('Error in getAllComplaintsStatus:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const submitComplaint = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const userId = req.user.id;

    const result = await withConnection(async (conn) => {
      return await conn.execute(
        `INSERT INTO complaints (user_id, title, description, location)
         VALUES (HEXTORAW(:userId), :title, :description, :location)
         RETURNING RAWTOHEX(id) INTO :id`,
        {
          userId,
          title,
          description,
          location,
          id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        },
        { autoCommit: true }
      );
    });

    const id = result.outBinds.id[0];

    complaintsList.addComplaint({
      id,
      fullName:         req.user.name,
      email:            req.user.email,
      phone:            req.user.mobile,
      location,
      complaintDetails: description,
      status:           'Pending',
      createdAt:        new Date(),
    });

    leaderboard.addComplaint(req.user.email, req.user.name);

    return res.status(201).json({ 
      message: 'Complaint submitted', 
      complaint: { id, title, description, location } 
    });
  } catch (err) {
    console.error('Error in submitComplaint:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ message: 'Missing fields' });

    const result = await withConnection(async (conn) => {
      return await conn.execute(
        `UPDATE complaints SET status = :status WHERE id = HEXTORAW(:id)`,
        { status, id },
        { autoCommit: true }
      );
    });

    if (result.rowsAffected === 0)
      return res.status(404).json({ message: 'Complaint not found' });

    return res.json({ message: 'Status updated' });
  } catch (err) {
    console.error('Error in updateComplaintStatus:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllComplaintsForAdmin = async (req, res) => {
  try {
    const result = await withConnection(async (conn) => {
      return await conn.execute(
        `SELECT RAWTOHEX(c.id) AS id,
                c.title, c.description, c.location, c.area,
                c.status, c.created_at, c.updated_at,
                u.name, u.email, u.mobile
         FROM complaints c
         JOIN users u ON u.id = c.user_id
         ORDER BY c.created_at DESC`
      );
    });

    const formatted = (result.rows || []).map(row => sanitizeRow(row));
    return res.json({ complaints: formatted });
  } catch (err) {
    console.error('Error in getAllComplaintsForAdmin:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// backend/controllers/report.controller.js
export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await withConnection(async (conn) => {
      return await conn.execute(
        `SELECT 
          RAWTOHEX(id) AS ID, 
          description, 
          status, 
          created_at, 
          location, 
          image 
         FROM complaints 
         WHERE user_id = HEXTORAW(:userId) 
         ORDER BY created_at DESC`,
        { userId },
        { outFormat: 4002 } // oracledb.OUT_FORMAT_OBJECT
      );
    });

    // Logging to see exactly what Oracle is sending back
    console.log("Database result rows:", result.rows);

    const complaints = result.rows.map(row => ({
      // Check if keys are uppercase (standard Oracle behavior)
      id: row.ID,
      description: row.DESCRIPTION,
      status: row.STATUS,
      createdAt: row.CREATED_AT,
      location: row.LOCATION,
      image: row.IMAGE || null
    }));

    res.json({ complaints });
  } catch (error) {
    console.error("Database Error Details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const undoStatus = async (req, res) => {
  try {
    // Basic check for undoStack existence
    if (typeof undoStack === 'undefined' || undoStack.isEmpty()) {
        return res.status(400).json({ message: 'Nothing to undo' });
    }

    const { id, oldStatus, newStatus } = undoStack.pop();

    const result = await withConnection(async (conn) => {
      return await conn.execute(
        `UPDATE complaints SET status = :status WHERE id = HEXTORAW(:id)`,
        { status: oldStatus, id },
        { autoCommit: true }
      );
    });

    if (result.rowsAffected === 0)
      return res.status(404).json({ message: 'Complaint not found' });

    complaintsList.updateStatus(id, oldStatus);
    leaderboard.updateComplaintStatus(req.user.email, oldStatus, newStatus);
    
    if (typeof redoStack !== 'undefined') {
        redoStack.push({ id, oldStatus: newStatus, newStatus: oldStatus });
    }

    return res.json({ message: 'Undo successful' });
  } catch (err) {
    console.error('Error in undoStatus:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const redoStatus = async (req, res) => {
  try {
    if (typeof redoStack === 'undefined' || redoStack.isEmpty()) {
        return res.status(400).json({ message: 'Nothing to redo' });
    }

    const { id, oldStatus, newStatus } = redoStack.pop();

    const result = await withConnection(async (conn) => {
      return await conn.execute(
        `UPDATE complaints SET status = :status WHERE id = HEXTORAW(:id)`,
        { status: newStatus, id },
        { autoCommit: true }
      );
    });

    if (result.rowsAffected === 0)
      return res.status(404).json({ message: 'Complaint not found' });

    complaintsList.updateStatus(id, newStatus);
    leaderboard.updateComplaintStatus(req.user.email, newStatus, oldStatus);
    
    if (typeof undoStack !== 'undefined') {
        undoStack.push({ id, oldStatus, newStatus });
    }

    return res.json({ message: 'Redo successful' });
  } catch (err) {
    console.error('Error in redoStatus:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};