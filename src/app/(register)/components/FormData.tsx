'use client'

import { handleRegister } from "@/services/handleRegister";
import Link from "next/link";

export const FormData = () => {

  return (
    <form className="space-y-4" action={async formData => {
      handleRegister(formData)
    }}>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
      </div>
      <div className="flex flex-col gap-4 items-center">
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Register
        </button>
        <p className="text-sm">-OR-</p>
        <Link href={'/login'}
          className="w-full px-4 py-2 text-center font-bold text-indigo-600 border-indigo-600 rounded-md hover:border-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Login
        </Link>
      </div>
    </form>
  )
}