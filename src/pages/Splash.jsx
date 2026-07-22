import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        navigate('/login')
        return
      }

      // Session exists — fetch role and redirect accordingly
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || !profile) {
        navigate('/login')
        return
      }

      if (profile.role === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/customer-dashboard')
      }
    }

    checkSession()
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <h1>AgriShop</h1>
      <p>Loading...</p>
    </div>
  )
}

export default Splash