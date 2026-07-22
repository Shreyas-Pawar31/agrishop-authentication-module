import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'signup'
    })

    setLoading(false)

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Verified! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1200)
    }
  }

  if (!email) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
        <p>No email found. Please sign up first.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Verify Your Email</h2>
      <p>We sent a code to {email}</p>
      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '10px' }}>
          <label>Enter 8-digit code</label><br />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={8}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      {message && <p style={{ marginTop: '15px' }}>{message}</p>}
    </div>
  )
}

export default VerifyOtp