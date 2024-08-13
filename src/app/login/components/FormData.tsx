'use client'

import { handleLogin } from "@/services/handleLogin";

export const FormData = () => {

  return (
    <form className="space-y-4" action={async formData => {
       handleLogin(formData)
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

      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        Login
      </button>
    </form>
  )
}