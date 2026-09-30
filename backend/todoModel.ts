import pool from './db';

export const todoModel = {
  getAll: async (userId: number, page: number = 1, perPage: number = 50) => {
    const offset = (page - 1) * perPage;
    const [rows]: any = await pool.query(
      'SELECT id, task, is_completed, created_at FROM todos WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
      [userId, perPage, offset]
    );
    return rows;
  },

  getById: async (id: number, userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT id, task, is_completed, created_at FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  },

  create: async (task: string, userId: number) => {
    const [result]: any = await pool.query(
      'INSERT INTO todos (task, is_completed, user_id) VALUES (?, ?, ?)',
      [task, false, userId]
    );
    return { id: result.insertId, task, is_completed: false, user_id: userId };
  },

  update: async (id: number, task: string | undefined, isCompleted: boolean | undefined, userId: number) => {
    const fields: string[] = [];
    const values: any[] = [];
    if (task !== undefined) { fields.push('task = ?'); values.push(task); }
    if (isCompleted !== undefined) { fields.push('is_completed = ?'); values.push(isCompleted); }
    if (fields.length === 0) return 0;
    values.push(id, userId);
    const [result]: any = await pool.query(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values
    );
    return result.affectedRows;
  },

  delete: async (id: number, userId: number) => {
    const [result]: any = await pool.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows;
  }
};

export default todoModel;
