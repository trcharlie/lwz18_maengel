'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

interface Mangel {
  id: number
  title: string
  comment: string
  image_path: string | null
  is_done: boolean
  created_at: string
}

export default function Home() {
  const [maengel, setMaengel] = useState<Mangel[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setIsAdmin(adminStatus)
    fetchMaengel()
  }, [])

  const fetchMaengel = async () => {
    try {
      const { data, error } = await supabase
        .from('maengel')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMaengel(data || [])
    } catch (error) {
      console.error('Fehler beim Laden der Mängel:', error)
      toast.error('Fehler beim Laden der Mängel')
    }
  }

  const toggleMangelStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('maengel')
        .update({ is_done: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchMaengel()
      toast.success('Status erfolgreich aktualisiert')
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error)
      toast.error('Fehler beim Aktualisieren des Status')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maengel.map((mangel) => (
            <div
              key={mangel.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
                mangel.is_done ? 'opacity-75' : ''
              }`}
            >
              {mangel.image_path && (
                <div className="relative h-48 w-full">
                  <Image
                    src={mangel.image_path}
                    alt={mangel.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{mangel.title}</h2>
                <p className="text-gray-600 mb-4">{mangel.comment}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(mangel.created_at).toLocaleDateString('de-DE')}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => toggleMangelStatus(mangel.id, mangel.is_done)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        mangel.is_done
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {mangel.is_done ? 'Erledigt' : 'Offen'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 