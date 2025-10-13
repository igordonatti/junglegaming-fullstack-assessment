/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRootRoute, createRouter, Outlet, Link } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { useAuthStore } from '../contexts/auth-store'
import { useNotificationsStore } from '../contexts/notifications-store'
import { ToastViewport, useToast } from '../components/ui/toast'
import { useEffect } from 'react'
import { getSocket, initSocket, disconnectSocket } from '../lib/socket'
import { Toaster } from '../components/ui/sonner'
import { toast as sonnerToast } from 'sonner'
import type { SocketNotification } from '../types/socket-events'
import { useNotificationListener } from '@/hooks/useNotificationListener'
import { getCurrentUserId } from '@/lib/auth-helpers'

export const rootRoute = createRootRoute({
  component: function RootComponent() {

    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const unread = useNotificationsStore((s) => s.unreadCount)
    const addNotif = useNotificationsStore((s) => s.add)
    const toast = useToast((s) => s.toast)

    useNotificationListener(); 

    useEffect(() => {
      if (isAuthenticated) {
        const userId = getCurrentUserId()
        if (userId) {
          initSocket(userId)
        }
      } else {
        disconnectSocket()
      }
    }, [isAuthenticated])

    useEffect(() => {
      const socket = getSocket()
      if (!socket) return
      const onNewNotification = (payload: SocketNotification) => {
        if (!payload?.message) return
        sonnerToast(payload.message)
        addNotif(payload.message)
      }
      const onTaskCreated = (_payload: unknown) => {
        toast({ title: 'Nova tarefa criada' })
        addNotif('Nova tarefa criada')
      }
      const onTaskUpdated = (_payload: unknown) => {
        toast({ title: 'Tarefa atualizada' })
        addNotif('Tarefa atualizada')
      }
      const onCommentNew = (_payload: unknown) => {
        toast({ title: 'Novo comentário' })
        addNotif('Novo comentário')
      }
      socket.on('new_notification', onNewNotification)
      socket.on('task:created', onTaskCreated)
      socket.on('task:updated', onTaskUpdated)
      socket.on('comment:new', onCommentNew)
      return () => {
        socket.off('new_notification', onNewNotification)
        socket.off('task:created', onTaskCreated)
        socket.off('task:updated', onTaskUpdated)
        socket.off('comment:new', onCommentNew)
      }
    }, [addNotif, toast])
    
    return (
      <div className="min-h-screen">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
            <Link to="/" className="font-semibold">Task Manager</Link>
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/tasks" className="text-sm">Tasks</Link>
                  <button className="relative text-sm" aria-label="Notificações">
                    🔔
                    {unread > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1 text-[10px] text-white">{unread}</span>}
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-sm">Login</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4">
          <Outlet />
        </main>
        <ToastViewport />
        <Toaster position="top-right" richColors />
      </div>
    )
  },
})

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


