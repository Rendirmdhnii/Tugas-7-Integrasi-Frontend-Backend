import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { todoModel } from './todoModel';
import { userModel } from './userModel';
import { authenticateToken, AuthRequest } from './authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_tugas7';

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email: email || null,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      data: newUser,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Gagal mendaftar' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      data: {
        token,
        user: { id: user.id, username: user.username, email: user.email },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Gagal login' });
  }
});

// Todos Routes (Protected)
app.get('/api/todos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 50;

    const todos = await todoModel.getAll(userId, page, perPage);
    res.json({ data: todos });
  } catch (error: any) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: error.message || 'Gagal mengambil data todo' });
  }
});

app.get('/api/todos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);

    const todo = await todoModel.getById(id, userId);
    if (!todo) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    res.json({ data: todo });
  } catch (error: any) {
    console.error('Get todo by id error:', error);
    res.status(500).json({ message: error.message || 'Gagal mengambil detail tugas' });
  }
});

app.post('/api/todos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { task, todo } = req.body;
    const taskContent = task || todo;

    if (!taskContent || typeof taskContent !== 'string' || !taskContent.trim()) {
      return res.status(400).json({ message: 'Isi tugas tidak boleh kosong' });
    }

    const newTodo = await todoModel.create(taskContent.trim(), userId);
    res.status(201).json({ message: 'Tugas berhasil dibuat', data: newTodo });
  } catch (error: any) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: error.message || 'Gagal membuat tugas' });
  }
});

app.put('/api/todos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);
    const { task, isCompleted, title, completed } = req.body;

    const taskVal = task !== undefined ? task : title;
    const isCompletedVal = isCompleted !== undefined ? isCompleted : completed;

    const affectedRows = await todoModel.update(id, taskVal, isCompletedVal, userId);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan atau tidak ada perubahan' });
    }

    res.json({ message: 'Tugas berhasil diperbarui' });
  } catch (error: any) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: error.message || 'Gagal memperbarui tugas' });
  }
});

app.delete('/api/todos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);

    const affectedRows = await todoModel.delete(id, userId);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    res.json({ message: 'Tugas berhasil dihapus' });
  } catch (error: any) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: error.message || 'Gagal menghapus tugas' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
