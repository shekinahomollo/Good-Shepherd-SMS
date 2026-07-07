import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { useAuthStore }  from '../store/authStore'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login, user }         = useAuthStore()
  const navigate                = useNavigate()

  // Redirect if already logged in
  if (user) {
    const path = user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/teacher' : '/parent'
    navigate(path, { replace: true })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      const role = useAuthStore.getState().user?.role
      const path = role === 'ADMIN' ? '/admin' : role === 'TEACHER' ? '/teacher' : '/parent'
      navigate(path, { replace: true })
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* Left panel */}
      <div className="bg-ocean hidden md:flex flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-white/5 -top-20 -right-20" />
        <div className="absolute w-64 h-64 rounded-full bg-teal/20 -bottom-16 -left-16" />

        <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-4xl mb-6 z-10">
          🌟
        </div>
        <h1 className="font-display text-4xl font-semibold text-white text-center z-10 leading-tight">
          Good Shepherd<br />School
        </h1>
        <p className="text-sky mt-3 text-sm text-center z-10">
          Nurturing minds. Growing futures.
        </p>

        <div className="flex gap-3 mt-12 z-10">
          {[['420', 'Students'], ['22', 'Teachers'], ['14', 'Classes']].map(([val, label]) => (
            <div key={label} className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-center">
              <div className="font-display text-xl text-gold leading-none">{val}</div>
              <div className="text-white/70 text-xs font-body">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col justify-center px-8 md:px-16 bg-cream">
        <div className="max-w-sm w-full mx-auto">

          <div className="mb-8 md:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-xl">🌟</div>
            <h2 className="font-display text-xl text-ocean font-semibold">Good Shepherd School</h2>
          </div>

          <h2 className="font-display text-3xl text-ocean font-semibold mb-1">Welcome back 👋</h2>
          <p className="text-sm text-[var(--text-muted)] mb-8">Sign in to your portal to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@goodshepherd.ac.ke"
                required
                className="w-full px-4 py-3 rounded-lg border border-ocean/20 bg-white font-body text-sm focus:outline-none focus:border-ocean transition-colors"
              />
            </div>

            <div>
              <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-ocean/20 bg-white font-body text-sm focus:outline-none focus:border-ocean transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ocean hover:bg-ocean-dark text-white font-display text-lg rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
            Forgot your password?{' '}
            <span className="text-teal font-semibold cursor-pointer hover:underline">Reset it here</span>
          </p>

          <div className="mt-8 p-4 bg-ocean/8 border-l-4 border-ocean rounded-lg text-xs text-[var(--text-muted)]">
            <strong className="text-ocean">Demo:</strong> Use the admin account you created —
            <br />admin@goodshepherd.ac.ke / Admin1234!
          </div>
        </div>
      </div>
    </div>
  )
}