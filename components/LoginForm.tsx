'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login-Versuch mit:', { username, password })

    try {
      // Erst prüfen wir, ob wir die Admin-Tabelle überhaupt lesen können
      const { data: testData, error: testError } = await supabase
        .from('admin')
        .select('*')
      
      if (testError) {
        console.error('Fehler beim Zugriff auf Admin-Tabelle:', testError)
        toast.error('Datenbankfehler')
        return
      }

      console.log('Verfügbare Admin-Einträge:', testData)

      // Dann versuchen wir den Login
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('username', username)
        .eq('password', password)

      if (error) {
        console.error('Fehler bei der Admin-Suche:', error)
        toast.error('Fehler beim Login')
        return
      }

      console.log('Login-Ergebnis:', data)

      if (data && data.length > 0) {
        localStorage.setItem('isAdmin', 'true')
        toast.success('Erfolgreich eingeloggt')
        onLogin()
      } else {
        console.log('Keine übereinstimmenden Anmeldedaten gefunden für:', { username, password })
        toast.error('Ungültige Anmeldedaten')
      }
    } catch (error) {
      console.error('Unerwarteter Fehler beim Login:', error)
      toast.error('Unerwarteter Fehler beim Login')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase
        .from('admin')
        .update({ password: newPassword })
        .eq('username', username)

      if (error) {
        console.error('Fehler beim Ändern des Passworts:', error)
        toast.error('Fehler beim Ändern des Passworts: ' + error.message)
        return
      }

      setNewPassword('')
      setIsChangingPassword(false)
      toast.success('Passwort erfolgreich geändert')
    } catch (error) {
      console.error('Unerwarteter Fehler beim Ändern des Passworts:', error)
      toast.error('Unerwarteter Fehler beim Ändern des Passworts')
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Benutzername
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Passwort
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Anmelden
        </button>
      </form>

      <button
        onClick={() => setIsChangingPassword(!isChangingPassword)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        {isChangingPassword ? 'Abbrechen' : 'Passwort ändern'}
      </button>

      {isChangingPassword && (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Neues Passwort
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Passwort ändern
          </button>
        </form>
      )}
    </div>
  )
} 