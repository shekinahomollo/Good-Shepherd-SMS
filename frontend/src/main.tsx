import React          from 'react'
import ReactDOM       from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster }    from 'react-hot-toast'
import { queryClient }        from './lib/queryClient'
import ErrorBoundary  from './components/ui/ErrorBoundary'
import App            from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Quicksand, sans-serif',
              borderRadius: '10px',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)