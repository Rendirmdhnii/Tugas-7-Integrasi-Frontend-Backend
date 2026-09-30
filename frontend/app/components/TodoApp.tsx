'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { todoService } from '@/services/todoService';
import { Todo } from '@/types/todo';
import { Badge } from './ui/badge';

export default function TodoApp() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Auth Guard & Initial Load
  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const user = authService.getUser();
    if (user) {
      setCurrentUser(user);
    }

    loadTodos();
  }, [router]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const rawData = await todoService.getTodos();

      // Normalize items to match Todo interface
      const formatted: Todo[] = (rawData || []).map((item: any) => ({
        id: item.id,
        title: item.title || item.task || 'Tugas tanpa judul',
        completed: item.completed !== undefined ? Boolean(item.completed) : Boolean(item.is_completed),
        createdAt: item.createdAt || item.created_at || (item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : new Date().toLocaleDateString('id-ID')),
      }));

      setTodos(formatted);
    } catch (err: any) {
      console.error('Error loading todos:', err);
      if (err?.status === 401 || err?.status === 403) {
        authService.logout();
        router.push('/login');
      } else {
        setError(err?.message || 'Gagal mengambil data tugas.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      await todoService.createTodo({ todo: newTitle.trim() });
      setNewTitle('');
      await loadTodos();
    } catch (err: any) {
      console.error('Error adding todo:', err);
      setError(err?.message || 'Gagal menambahkan tugas baru.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const nextCompleted = !todo.completed;
      // Optimistic UI update
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed: nextCompleted } : t))
      );

      await todoService.updateTodo(todo.id, {
        task: todo.title,
        isCompleted: nextCompleted,
      });
    } catch (err: any) {
      console.error('Error updating todo:', err);
      setError(err?.message || 'Gagal memperbarui status tugas.');
      // Rollback on error
      await loadTodos();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;

    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await todoService.deleteTodo(id);
    } catch (err: any) {
      console.error('Error deleting todo:', err);
      setError(err?.message || 'Gagal menghapus tugas.');
      await loadTodos();
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Top Navbar / Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 font-bold border border-purple-100 text-lg">
            {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Sedang Masuk Sebagai</p>
            <h2 className="text-base font-bold text-dark-100">{currentUser?.username || 'Pengguna'}</h2>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-100 flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar (Logout)
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Card Header & Add Form */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-bold text-dark-100">Kelola Tugas Harian</h2>
              <p className="text-sm text-muted">
                {todos.length === 0
                  ? 'Belum ada tugas tercatat'
                  : `${completedCount} dari ${todos.length} tugas selesai`}
              </p>
            </div>
            {todos.length > 0 && (
              <Badge variant="purple" size="default">
                {Math.round((completedCount / todos.length) * 100) || 0}% Selesai
              </Badge>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">
                &times;
              </button>
            </div>
          )}

          {/* Form Input Todo */}
          <form onSubmit={handleAddTodo} className="flex gap-2.5">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Tambahkan tugas baru..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-dark-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition text-sm bg-white shadow-sm"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newTitle.trim()}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md shadow-purple-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm shrink-0"
            >
              {submitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Tambah</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Filter Navigation */}
        <div className="flex border-b border-gray-100 px-6 py-2.5 bg-gray-50/50 text-sm gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-white text-purple-700 shadow-sm border border-gray-200'
                : 'text-muted hover:text-dark-100'
            }`}
          >
            Semua ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'active'
                ? 'bg-white text-purple-700 shadow-sm border border-gray-200'
                : 'text-muted hover:text-dark-100'
            }`}
          >
            Belum Selesai ({todos.length - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'completed'
                ? 'bg-white text-purple-700 shadow-sm border border-gray-200'
                : 'text-muted hover:text-dark-100'
            }`}
          >
            Selesai ({completedCount})
          </button>
        </div>

        {/* Todo Items List */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-sm text-muted">Memuat daftar tugas...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-dark-100">Tidak ada tugas</h3>
              <p className="text-sm text-muted mt-1">
                {filter === 'all'
                  ? 'Mulai dengan menambahkan tugas baru di atas.'
                  : 'Tidak ada tugas yang sesuai dengan filter ini.'}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                      className="w-5 h-5 rounded-md text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer transition"
                    />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-sm font-medium block truncate transition ${
                          todo.completed ? 'line-through text-gray-400' : 'text-dark-100'
                        }`}
                      >
                        {todo.title}
                      </span>
                      <span className="text-xs text-muted mt-0.5 block">
                        Dibuat: {todo.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge size="sm" variant={todo.completed ? 'green' : 'yellow'}>
                      {todo.completed ? 'Selesai' : 'Belum'}
                    </Badge>

                    <Link
                      href={`/task/${todo.id}`}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-dark-70 border border-gray-200 rounded-lg transition"
                      title="Lihat Detail Tugas"
                    >
                      Detail
                    </Link>

                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Hapus Tugas"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
