import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppShellProps {
  children: ReactNode
  pageTitle: string
}

export default function AppShell({ children, pageTitle }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-[240px]">
        <Topbar pageTitle={pageTitle} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}