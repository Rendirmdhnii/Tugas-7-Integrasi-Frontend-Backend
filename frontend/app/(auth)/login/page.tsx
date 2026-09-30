import React from 'react';
import LoginForm from './components/LoginForm';

export const metadata = {
  title: 'Masuk - Todo App',
  description: 'Masuk ke akun Todo App Anda',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <LoginForm />
    </main>
  );
}
