'use client'

import { Mangel } from '@/lib/supabase'
import Image from 'next/image'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface MangelListProps {
  maengel: Mangel[]
}

export default function MangelList({ maengel }: MangelListProps) {
  const [maengelList, setMaengelList] = useState(maengel)

  const toggleMangelStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('maengel')
        .update({ is_done: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setMaengelList(maengelList.map(m => 
        m.id === id ? { ...m, is_done: !currentStatus } : m
      ))

      toast.success('Status aktualisiert')
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error)
      toast.error('Fehler beim Aktualisieren des Status')
    }
  }

  const deleteMangel = async (id: number) => {
    if (!confirm('Möchten Sie diesen Mangel wirklich löschen?')) return

    try {
      const { error } = await supabase
        .from('maengel')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMaengelList(maengelList.filter(m => m.id !== id))
      toast.success('Mangel gelöscht')
    } catch (error) {
      console.error('Fehler beim Löschen des Mangels:', error)
      toast.error('Fehler beim Löschen des Mangels')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {maengelList.map((mangel) => (
        <div key={mangel.id} className="border rounded-lg p-4 shadow-sm">
          <div className="relative h-48 mb-4">
            <Image
              src={`/${mangel.image_path}`}
              alt={mangel.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{mangel.title}</h2>
          <p className="text-gray-600 mb-4">{mangel.comment}</p>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={mangel.is_done}
                onChange={() => toggleMangelStatus(mangel.id, mangel.is_done)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                {mangel.is_done ? 'Erledigt' : 'Offen'}
              </span>
            </label>
            <button
              onClick={() => deleteMangel(mangel.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Löschen
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 