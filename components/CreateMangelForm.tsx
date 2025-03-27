'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface CreateMangelFormProps {
  onClose: () => void;
}

export default function CreateMangelForm({ onClose }: CreateMangelFormProps) {
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setIsAdmin(adminStatus)
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = fileName

      // Lade das Bild hoch
      const { error: uploadError } = await supabase.storage
        .from('maengel')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Fehler beim Hochladen:', uploadError)
        throw uploadError
      }

      // Hole die öffentliche URL mit der korrekten Bucket-URL
      const { data } = supabase.storage
        .from('maengel')
        .getPublicUrl(filePath)

      // Stelle sicher, dass die URL korrekt ist
      if (!data.publicUrl) {
        throw new Error('Keine öffentliche URL verfügbar')
      }

      return data.publicUrl
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error)
      toast.error('Fehler beim Hochladen des Bildes: ' + (error as Error).message)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = null
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage)
      }

      const { error } = await supabase
        .from('maengel')
        .insert([
          {
            title,
            comment,
            image_path: imageUrl,
            is_done: false
          }
        ])

      if (error) throw error

      toast.success('Mangel erfolgreich erstellt')
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Fehler beim Erstellen des Mangels:', error)
      toast.error('Fehler beim Erstellen des Mangels')
    } finally {
      setLoading(false)
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bild
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowImageDialog(true)}
              className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Bild auswählen
            </button>
            {previewUrl && (
              <div className="relative w-20 h-20">
                <Image
                  src={previewUrl}
                  alt="Vorschau"
                  fill
                  sizes="80px"
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Mangel erstellen
        </button>
      </div>

      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Bild auswählen</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="mb-4"
            />
            {previewUrl && (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={previewUrl}
                  alt="Vorschau"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowImageDialog(false)}
                className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Schließen
              </button>
              <button
                type="button"
                onClick={() => {
                  if (previewUrl) {
                    setShowImageDialog(false)
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={!previewUrl}
              >
                Auswählen
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
} 