import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile()
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      if (session) fetchProfile()
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      setProfile({
        role: user?.user_metadata?.role || 'Patient',
        onboarding_status: user?.user_metadata?.onboarding_status || 'pending_verification',
        email: user?.email,
        id: user?.id,
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return { session, profile, role: profile?.role, loading, logout, user: profile }
}
