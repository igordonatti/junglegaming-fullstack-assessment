import { create } from 'zustand'

type Toast = { id: number; title: string; description?: string }

type ToastState = {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  toast: (t) => set((s) => ({ toasts: [...s.toasts, { id: Date.now(), ...t }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))

export function ToastViewport() {
  const toasts = useToast((s) => s.toasts)
  const dismiss = useToast((s) => s.dismiss)
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="rounded border bg-white p-3 shadow">
          <div className="font-medium">{t.title}</div>
          {t.description && <div className="text-sm text-muted-foreground">{t.description}</div>}
          <button className="mt-2 text-xs underline" onClick={() => dismiss(t.id)}>Fechar</button>
        </div>
      ))}
    </div>
  )
}


