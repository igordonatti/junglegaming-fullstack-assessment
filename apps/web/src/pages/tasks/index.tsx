import { useState } from 'react'
import { useTasksListQuery, useCreateTaskMutation } from '../../hooks/useTaskQuery'
import { Button } from '../../components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '../../components/ui/dialog'
import { TaskForm } from '../../components/TaskForm'
import { Link } from '@tanstack/react-router'

export default function TasksPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useTasksListQuery({ page, limit: 10 })
  const createTask = useCreateTaskMutation()

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />))}</div>
  if (isError) return <div className="text-red-600">Erro ao carregar tarefas</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Tarefas</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nova Tarefa</Button>
          </DialogTrigger>
          <DialogContent>
            <h3 className="text-lg font-medium mb-3">Criar tarefa</h3>
            <TaskForm onSubmit={(values) => createTask.mutate(values)} />
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-2">
        {data?.items.map((t) => (
          <li key={t.id} className="p-4 border rounded">
            <Link to="/tasks/$taskId" params={{ taskId: t.id }} className="font-medium hover:underline">{t.title}</Link>
            <div className="text-xs text-muted-foreground">{t.status} • {t.priority}</div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
        <Button variant="outline" disabled={page >= (data?.meta.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
      </div>
    </div>
  )
}


