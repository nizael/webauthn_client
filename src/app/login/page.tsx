'use client'
import { FormData } from './components/FormData';

export default function Login() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <FormData />
      </div>
    </div>
  );
};
