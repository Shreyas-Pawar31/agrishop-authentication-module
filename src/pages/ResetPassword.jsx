import { validatePassword } from '../utils/validatePassword'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleUpdate = async (e) => {
    e.preventDefault()

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setMessage(`Error: Password must contain ${passwordErrors.join(', ')}`)
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Password updated! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Set New Password</h2>
        <form onSubmit={handleUpdate}>
          <div className="auth-field">
            <label>New Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--green-dark)', marginTop: '4px' }}>
              Must be 8+ characters with uppercase, lowercase, number, and symbol
            </p>
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        {message && (
          <p className={`auth-message ${message.startsWith('Error') ? 'error' : ''}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default ResetPassword