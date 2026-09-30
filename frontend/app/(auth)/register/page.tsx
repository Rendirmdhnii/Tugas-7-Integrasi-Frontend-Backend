import React from 'react';
import RegisterForm from './components/RegisterForm';

export const metadata = {
  title: 'Daftar Akun - Todo App',
  description: 'Daftar akun baru untuk mengakses aplikasi Todo List',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <RegisterForm />
    </main>
  );
}
