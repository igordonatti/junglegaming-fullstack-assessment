import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import type { TaskPriority, Task, User } from '../../../../packages/types/index'
import { taskPriorities } from '@/types/task-status'
import { useUsersQuery } from '@/hooks/useTaskQuery'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.custom<TaskPriority>(),
  assigneeIds: z.array(z.string()).optional(),
})

type Values = z.infer<typeof schema>

export function TaskForm({ initial, onSubmit }: { initial?: Partial<Task>; onSubmit: (payload: Values) => void }) {
  const { data: users, isLoading: usersLoading } = useUsersQuery()

  const initialAssigneeIds: string[] = Array.isArray(initial?.assigneeIds)
    ? (initial!.assigneeIds as unknown[]).map((u: any) => (typeof u === 'string' ? u : (u as User).id))
    : []

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      priority: (initial?.priority ?? 'MEDIUM') as TaskPriority,
      assigneeIds: initialAssigneeIds,
    },
  })

  return (
    <form className="space-y-3 flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Título" {...form.register('title')} />
      <Input placeholder="Descrição" {...form.register('description')} />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Atribuir para</span>
        {usersLoading ? (
          <div className="h-9 bg-gray-100 animate-pulse rounded" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {(() => {
              const selectedIds = form.watch('assigneeIds') ?? []
              return (users ?? []).map((user) => {
                const selected = selectedIds.includes(user.id)
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    const current = new Set(selectedIds)
                    if (current.has(user.id)) current.delete(user.id)
                    else current.add(user.id)
                    form.setValue('assigneeIds', Array.from(current), { shouldDirty: true, shouldTouch: true })
                  }}
                  className={
                    selected
                      ? 'flex items-center gap-2 rounded-full bg-amber-600 text-white px-3 py-1'
                      : 'flex items-center gap-2 rounded-full border px-3 py-1'
                  }
                >
                  <div className={selected ? 'size-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-semibold' : 'size-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-semibold'}>
                    {user.username?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.username || user.email}</span>
                </button>
                )
              })
            })()}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 justify-between">
        <select className="h-9 rounded-md border px-3 text-sm" {...form.register('priority')}>
          {taskPriorities.map((p)=> (<option key={p.value} value={p.value}>{p.label}</option>))}
        </select>
        <Button type="submit">Salvar</Button>
      </div>
      
    </form>
  )
}


