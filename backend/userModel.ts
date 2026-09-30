import pool from './db';

export const userModel = {
  findByUsername: async (username: string) => {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  },
  findByEmail: async (email: string) => {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },
  create: async (user: { username: string; email?: string; password: string }) => {
    const [result]: any = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [user.username, user.email || null, user.password]
    );
    return { id: result.insertId, username: user.username, email: user.email };
  }
};

export default userModel;
