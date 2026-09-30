import React from 'react';
import Link from 'next/link';
import { Badge } from '@/app/components/ui/badge';
import { Todo } from '@/types/todo';

export default function TaskDetailCard({ todo }: { todo: Todo }) {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-white text-dark-70">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <header className="mb-6 border-b border-gray-100 pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark-100">Detail Tugas</h1>
          <Link className="text-sm font-semibold bg-gray-50 hover:bg-gray-100 text-dark-70 border border-gray-200 px-3.5 py-2 rounded-lg transition shadow-sm" href="/">Kembali ke Daftar</Link>
        </header>
        <div className="space-y-4">
          <div><label className="text-xs font-semibold text-muted uppercase tracking-wider">ID Tugas</label><div className="mt-1"><Badge size="default" variant="purple">#{todo.id}</Badge></div></div>
          <div><label className="text-xs font-semibold text-muted uppercase tracking-wider">Judul Tugas</label><h2 className="text-xl font-bold text-dark-100 mt-0.5">{todo.title}</h2></div>
          <div><label className="text-xs font-semibold text-muted uppercase tracking-wider">Status</label><div className="mt-1"><Badge size="sm" variant={todo.completed ? 'green' : 'yellow'}>{todo.completed ? 'Selesai' : 'Belum Selesai'}</Badge></div></div>
          <div><label className="text-xs font-semibold text-muted uppercase tracking-wider">Tanggal Dibuat</label><p className="text-muted text-sm mt-1">{todo.createdAt}</p></div>
        </div>
      </div>
    </main>
  );
}
