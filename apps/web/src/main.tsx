/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
// App routed via TanStack Router; no direct App render
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuthStore } from './contexts/auth-store'
import { getCurrentUserId } from './lib/auth-helpers'
import { initSocket, disconnectSocket } from './lib/socket'
import { useNotificationListener } from './hooks/useNotificationListener'

const queryClient = new QueryClient()

function SocketInit() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    console.log('SocketInit effect: isAuthenticated=', isAuthenticated)
    if (isAuthenticated) {
      const userId = getCurrentUserId()
      if (userId) {
        initSocket(userId)
      }
    } else {
      disconnectSocket()
    }
  }, [isAuthenticated])

  useNotificationListener();

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <SocketInit />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
