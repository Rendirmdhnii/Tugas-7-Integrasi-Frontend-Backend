import React from 'react';
import TodoApp from './components/TodoApp';

export const metadata = {
  title: 'Daftar Tugas (Todo List) - Integrasi Frontend & Backend',
  description: 'Aplikasi Todo List Tugas #7 Integrasi Database Express & Next.js',
};

export default function HomePage() {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-gray-50/40 text-dark-70">
      <header className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-dark-100 tracking-tight sm:text-4xl">
          Daftar Tugas (Todo List)
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tugas #7 Integrasi Frontend &amp; Backend (Express.js &amp; Next.js)
        </p>
      </header>

      <TodoApp />
    </main>
  );
}
