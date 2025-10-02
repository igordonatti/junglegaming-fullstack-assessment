import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import type { TaskPriority, Task } from '@repo/types'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.custom<TaskPriority>(),
})

type Values = z.infer<typeof schema>

export function TaskForm({ initial, onSubmit }: { initial?: Partial<Task>; onSubmit: (payload: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      priority: (initial?.priority ?? 'MEDIUM') as TaskPriority,
    },
  })

  return (
    <form className="space-y-3 flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Título" {...form.register('title')} />
      <Input placeholder="Descrição" {...form.register('description')} />
      <div className="flex items-center gap-2 justify-between">
        <select className="h-9 rounded-md border px-3 text-sm" {...form.register('priority')}>
          {['LOW','MEDIUM','HIGH','URGENT'].map((p)=> (<option key={p} value={p}>{p}</option>))}
        </select>
        <Button type="submit">Salvar</Button>
      </div>
      
    </form>
  )
}


