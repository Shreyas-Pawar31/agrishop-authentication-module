import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

function ProtectedRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      if (!requiredRole) {
        // No specific role required, just needs to be logged in
        setAuthorized(true)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      setAuthorized(profile?.role === requiredRole)
      setLoading(false)
    }

    checkAccess()
  }, [requiredRole])

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Checking access...</p>
  }

  if (!authorized) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute