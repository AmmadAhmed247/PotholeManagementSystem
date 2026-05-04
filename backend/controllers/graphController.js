import { withConnection } from '../services/Db.js';
import { cityGraph } from '../services/graphComplaints.js';

export const addComplaintToArea = async (req, res) => {
  const { area, title, description, userId } = req.body;

  if (!area || !title || !description || !userId)
    return res.status(400).json({ message: 'All fields required' });

  const result = await withConnection((conn) =>
    conn.execute(
      `INSERT INTO complaints (user_id, title, description, location, area)
       VALUES (HEXTORAW(:userId), :title, :description, :area, :area)
       RETURNING RAWTOHEX(id) INTO :id`,
      {
        userId,
        title,
        description,
        area,
        id: { dir: 3003, type: 2001 },
      },
      { autoCommit: true }
    )
  );

  const complaint = { id: result.outBinds.id[0], userId, title, description, area };

  cityGraph.addComplaint(area, complaint);

  res.status(201).json({ message: 'Complaint added', complaint });
};