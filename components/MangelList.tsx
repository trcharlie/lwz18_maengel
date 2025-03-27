'use client'

import { Mangel } from '@/lib/supabase'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface MangelListProps {
  maengel: Mangel[]
  onUpdate?: () => void
}

export default function MangelList({ maengel, onUpdate }: MangelListProps) {
  const [maengelList, setMaengelList] = useState(maengel)
  const [selectedMangel, setSelectedMangel] = useState<Mangel | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Prüfe Admin-Status
  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true')
  }, [])

  // Aktualisiere die lokale Liste wenn sich die Props ändern
  useEffect(() => {
    setMaengelList(maengel)
  }, [maengel])

  const toggleMangelStatus = async (id: number, currentStatus: boolean) => {
    if (!isAdmin) return

    try {
      const { error } = await supabase
        .from('maengel')
        .update({ is_done: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setMaengelList(maengelList.map(m => 
        m.id === id ? { ...m, is_done: !currentStatus } : m
      ))

      if (selectedMangel?.id === id) {
        setSelectedMangel({ ...selectedMangel, is_done: !currentStatus })
      }

      if (onUpdate) {
        onUpdate()
      }

      toast.success('Status aktualisiert')
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error)
      toast.error('Fehler beim Aktualisieren des Status')
    }
  }

  const deleteMangel = async (id: number) => {
    if (!isAdmin) return
    
    if (!confirm('Möchten Sie diesen Mangel wirklich löschen?')) return

    try {
      const { error } = await supabase
        .from('maengel')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMaengelList(maengelList.filter(m => m.id !== id))
      setSelectedMangel(null)
      
      if (onUpdate) {
        onUpdate()
      }
      
      toast.success('Mangel gelöscht')
    } catch (error) {
      console.error('Fehler beim Löschen des Mangels:', error)
      toast.error('Fehler beim Löschen des Mangels')
    }
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {maengelList.map((mangel) => (
            <motion.div
              key={mangel.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMangel(mangel)}
            >
              <div className="relative h-48 mb-4">
                <Image
                  src={mangel.image_path || '/placeholder.jpg'}
                  alt={mangel.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-md"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{mangel.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{mangel.comment}</p>
              {isAdmin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={mangel.is_done}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleMangelStatus(mangel.id, mangel.is_done)
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      {mangel.is_done ? 'Erledigt' : 'Offen'}
                    </span>
                  </label>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMangel(mangel.id)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Löschen
                  </button>
                </div>
              )}
              {!isAdmin && (
                <div className="flex items-center">
                  <span className={`text-sm ${mangel.is_done ? 'text-green-600' : 'text-yellow-600'}`}>
                    {mangel.is_done ? '✓ Erledigt' : '⚠ Offen'}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMangel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => !isFullscreen && setSelectedMangel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedMangel.title}</h2>
                  <button 
                    onClick={() => setSelectedMangel(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div 
                  className="relative h-96 mb-6 cursor-zoom-in"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Image
                    src={selectedMangel.image_path || '/placeholder.jpg'}
                    alt={selectedMangel.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-contain rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-75 hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Beschreibung:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMangel.comment}</p>
                </div>

                {isAdmin && (
                  <motion.div 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMangel.is_done}
                        onChange={() => toggleMangelStatus(selectedMangel.id, selectedMangel.is_done)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">
                        {selectedMangel.is_done ? 'Erledigt' : 'Offen'}
                      </span>
                    </label>
                    <button
                      onClick={() => deleteMangel(selectedMangel.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Mangel löschen
                    </button>
                  </motion.div>
                )}
                {!isAdmin && (
                  <div className="flex items-center">
                    <span className={`text-sm ${selectedMangel.is_done ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedMangel.is_done ? '✓ Erledigt' : '⚠ Offen'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vollbild-Ansicht */}
      <AnimatePresence>
        {isFullscreen && selectedMangel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full p-4"
            >
              <Image
                src={selectedMangel.image_path || '/placeholder.jpg'}
                alt={selectedMangel.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsFullscreen(false)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 