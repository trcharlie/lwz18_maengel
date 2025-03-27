'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface ChangePasswordFormProps {
  onClose: () => void
}

export default function ChangePasswordForm({ onClose }: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Die neuen Passwörter stimmen nicht überein')
      return
    }

    setLoading(true)

    try {
      const { data: adminData, error: checkError } = await supabase
        .from('admin')
        .select('*')
        .eq('username', 'admin')
        .eq('password', oldPassword)
        .single()

      if (checkError || !adminData) {
        toast.error('Das aktuelle Passwort ist nicht korrekt')
        setLoading(false)
        return
      }

      const { error: updateError } = await supabase
        .from('admin')
        .update({ password: newPassword })
        .eq('username', 'admin')

      if (updateError) throw updateError

      toast.success('Passwort erfolgreich geändert')
      onClose()
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error)
      toast.error('Fehler beim Ändern des Passworts')
    } finally {
      setLoading(false)
    }
  }

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } }
  }

  const inputClasses = "w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2"

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        variants={inputVariants}
        whileFocus="focus"
      >
        <label htmlFor="oldPassword" className={labelClasses}>
          Aktuelles Passwort
        </label>
        <input
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className={inputClasses}
        />
      </motion.div>

      <motion.div
        variants={inputVariants}
        whileFocus="focus"
      >
        <label htmlFor="newPassword" className={labelClasses}>
          Neues Passwort
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={inputClasses}
        />
      </motion.div>

      <motion.div
        variants={inputVariants}
        whileFocus="focus"
      >
        <label htmlFor="confirmPassword" className={labelClasses}>
          Neues Passwort bestätigen
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={inputClasses}
        />
      </motion.div>

      <div className="flex justify-end space-x-4">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 text-gray-700 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100"
        >
          Abbrechen
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wird geändert...
            </div>
          ) : (
            'Passwort ändern'
          )}
        </motion.button>
      </div>
    </motion.form>
  )
} 