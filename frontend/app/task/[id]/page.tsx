'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { todoService } from '@/services/todoService';
import { authService } from '@/services/authService';
import TaskDetailCard from '@/app/components/TaskDetailCard';
import { Todo } from '@/types/todo';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (!id) return;

    const fetchTodo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await todoService.getTodoById(id);

        if (!data) {
          setError('Tugas tidak ditemukan.');
          return;
        }

        // Map response to Todo type
        const formattedTodo: Todo = {
          id: data.id,
          title: data.title || data.task || 'Tanpa Judul',
          completed: data.completed !== undefined ? Boolean(data.completed) : Boolean(data.is_completed),
          createdAt: data.createdAt || data.created_at || (data.createdAt ? new Date(data.createdAt).toLocaleString('id-ID') : new Date().toLocaleDateString('id-ID')),
        };

        setTodo(formattedTodo);
      } catch (err: any) {
        console.error('Error fetching todo detail:', err);
        setError(err?.message || 'Gagal memuat detail tugas.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted">Memuat detail tugas...</p>
        </div>
      </main>
    );
  }

  if (error || !todo) {
    return (
      <main className="min-h-screen p-6 md:p-10 bg-white text-dark-70">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-dark-100 mb-2">Terjadi Kesalahan</h2>
          <p className="text-muted text-sm mb-6">{error || 'Tugas tidak ditemukan'}</p>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold bg-gray-50 hover:bg-gray-100 text-dark-70 border border-gray-200 px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            Kembali ke Daftar Tugas
          </Link>
        </div>
      </main>
    );
  }

  return <TaskDetailCard todo={todo} />;
}
