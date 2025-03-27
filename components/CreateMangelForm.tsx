'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function CreateMangelForm() {
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setIsAdmin(adminStatus)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase
        .from('maengel')
        .insert([
          {
            title,
            comment,
            image_path: imagePath,
            is_done: false,
          },
        ])

      if (error) throw error

      setTitle('')
      setComment('')
      setImagePath('')
      toast.success('Mangel erfolgreich erstellt')
    } catch (error) {
      console.error('Fehler beim Erstellen des Mangels:', error)
      toast.error('Fehler beim Erstellen des Mangels')
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">Neuen Mangel erstellen</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titel
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Kommentar
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="imagePath" className="block text-sm font-medium text-gray-700">
            Bildpfad (z.B. images/mangel1.jpg)
          </label>
          <input
            type="text"
            id="imagePath"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Mangel erstellen
        </button>
      </div>
    </form>
  )
} 