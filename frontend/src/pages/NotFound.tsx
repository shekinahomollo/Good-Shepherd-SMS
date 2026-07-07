import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function NotFound() {
  const navigate  = useNavigate()
  const { user }  = useAuthStore()

  const goHome = () => {
    if (!user) { navigate('/login'); return }
    const path = user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/teacher' : '/parent'
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="font-display text-5xl font-semibold text-ocean mb-3">404</h1>
        <h2 className="font-display text-2xl font-semibold text-ocean mb-3">Page not found</h2>
        <p className="font-body text-sm text-[var(--text-muted)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={goHome}
          className="px-6 py-3 bg-ocean text-white font-display text-base rounded-lg hover:bg-ocean-dark transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}