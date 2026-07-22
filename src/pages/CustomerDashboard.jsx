import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function CustomerDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="dashboard-page">
      <button className="auth-button dashboard-logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="dashboard-content">
        <h1>Customer Dashboard</h1>
        <p>(placeholder)</p>
      </div>
    </div>
  )
}

export default CustomerDashboard