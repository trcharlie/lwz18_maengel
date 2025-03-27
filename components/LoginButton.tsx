'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'

export default function LoginButton() {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Admin Login</h2>
            <button
              onClick={() => setShowLogin(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <LoginForm onLogin={() => window.location.reload()} />
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowLogin(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Admin Login
    </button>
  )
} 