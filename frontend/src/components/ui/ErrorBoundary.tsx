import { Component, ReactNode } from 'react'

interface Props   { children: ReactNode }
interface State   { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-8">
          <div className="bg-white rounded-sms-lg border border-ocean/10 p-10 max-w-md w-full text-center shadow-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-display text-2xl font-semibold text-ocean mb-2">
              Something went wrong
            </h2>
            <p className="font-body text-sm text-[var(--text-muted)] mb-6">
              {this.state.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}