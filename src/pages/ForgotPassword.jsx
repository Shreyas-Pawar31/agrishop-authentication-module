import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5174/reset-password'
    })

    setLoading(false)

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for a password reset link.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleReset}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && (
          <p className={`auth-message ${message.startsWith('Error') ? 'error' : ''}`}>
            {message}
          </p>
        )}
        <p className="auth-link-row">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword