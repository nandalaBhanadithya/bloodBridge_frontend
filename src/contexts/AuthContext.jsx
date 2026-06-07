import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('auth_user')
    const storedRole = localStorage.getItem('auth_role')
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // In production, this would call Supabase Auth
    // Backend determines role based on user's account in the database
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation - accept any email/password for demo
        // Backend would determine role from database
        if (email && password) {
          // Simulate backend role determination based on email
          let determinedRole = 'donor' // default
          if (email.includes('admin')) determinedRole = 'admin'
          else if (email.includes('patient')) determinedRole = 'patient'
          else if (email.includes('volunteer')) determinedRole = 'volunteer'

          const userData = {
            id: 'user_' + Date.now(),
            email,
            name: email.split('@')[0],
            role: determinedRole,
          }
          setUser(userData)
          setRole(determinedRole)
          localStorage.setItem('auth_user', JSON.stringify(userData))
          localStorage.setItem('auth_role', determinedRole)
          localStorage.setItem('auth_token', 'mock_token_' + Date.now())
          resolve(userData)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_role')
    localStorage.removeItem('auth_token')
  }

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
