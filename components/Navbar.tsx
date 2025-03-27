'use client'

import { useState, useEffect } from 'react'
import LoginForm from './LoginForm'
import ChangePasswordForm from './ChangePasswordForm'
import CreateMangelForm from './CreateMangelForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showCreateMangel, setShowCreateMangel] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    setIsAdmin(false)
    window.location.reload()
  }

  return (
    <>
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/70 shadow-lg px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              Mängelübersicht
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <AnimatePresence mode="wait">
              {!isAdmin ? (
                <motion.button
                  key="login"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:px-6 sm:py-2.5 rounded-full hover:shadow-lg transform transition-all duration-200 flex items-center"
                  title="Admin Login"
                >
                  <svg className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Admin Login</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    key="change-password"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChangePassword(true)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-2 sm:px-6 sm:py-2.5 rounded-full hover:shadow-lg transform transition-all duration-200 flex items-center"
                    title="Passwort ändern"
                  >
                    <svg className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span className="hidden sm:inline">Passwort ändern</span>
                  </motion.button>
                  <motion.button
                    key="logout"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 sm:px-6 sm:py-2.5 rounded-full hover:shadow-lg transform transition-all duration-200 flex items-center"
                    title="Abmelden"
                  >
                    <svg className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Abmelden</span>
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: isMinimized ? 0 : 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white/90 backdrop-blur-md rounded-t-2xl shadow-lg border-t border-white/20 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Admin-Bereich</h3>
                  <motion.button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title={isMinimized ? "Maximieren" : "Minimieren"}
                  >
                    <svg 
                      className={`w-6 h-6 transform transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {!isMinimized && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateMangel(true)}
                            className="bg-white/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <h4 className="text-sm font-medium text-gray-700">Neuer Mangel</h4>
                            </div>
                            <p className="text-sm text-gray-500">Erstellen Sie einen neuen Mangel mit Bild und Beschreibung</p>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <h4 className="text-sm font-medium text-gray-700">Mängel verwalten</h4>
                            </div>
                            <p className="text-sm text-gray-500">Bearbeiten oder löschen Sie bestehende Mängel</p>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <h4 className="text-sm font-medium text-gray-700">Statistiken</h4>
                            </div>
                            <p className="text-sm text-gray-500">Übersicht über alle Mängel und deren Status</p>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateMangel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCreateMangel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-2xl w-full mx-4 shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Neuen Mangel erstellen
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateMangel(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  title="Schließen"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CreateMangelForm onClose={() => setShowCreateMangel(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showLogin || showChangePassword) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => {
              setShowLogin(false)
              setShowChangePassword(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showLogin ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    )}
                  </svg>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {showLogin ? 'Admin Login' : 'Passwort ändern'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowLogin(false)
                    setShowChangePassword(false)
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  title="Schließen"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {showLogin ? (
                <LoginForm onLogin={() => {
                  setIsAdmin(true)
                  setShowLogin(false)
                  window.location.reload()
                }} />
              ) : (
                <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}