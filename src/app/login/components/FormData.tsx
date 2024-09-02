'use client'

import { handleLogin } from "@/services/handleLogin";

export const FormData = () => {

  return (
    <form className="space-y-4" action={async formData => {
       handleLogin()
    }}>

      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        Sing in with a passkey
      </button>
    </form>
  )
}