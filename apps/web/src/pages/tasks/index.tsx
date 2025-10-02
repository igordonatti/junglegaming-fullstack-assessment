import { useState } from 'react'
import { useTasksListQuery, useCreateTaskMutation, useDeleteTaskMutation } from '../../hooks/useTaskQuery'
import { Button } from '../../components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '../../components/ui/dialog'
import { TaskForm } from '../../components/TaskForm'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import type { Task } from '../../../../../packages/types/index'

const taskStatuses = [
  { label: 'Pendente', value: 'TODO', className: 'bg-yellow-500' },
  { label: 'Em andamento', value: 'IN_PROGRESS', className: 'bg-blue-500' },
  { label: 'Concluída', value: 'COMPLETED', className: 'bg-green-500' },
  { label: 'Revisão', value: 'REVIEW', className: 'bg-purple-500' },
]

 const taskPriorities = [
  { label: 'Baixa', value: 'LOW', className: 'bg-green-500' },
  { label: 'Média', value: 'MEDIUM', className: 'bg-yellow-500' },
  { label: 'Alta', value: 'HIGH', className: 'bg-orange-500' },
  { label: 'Urgente', value: 'URGENT', className: 'bg-red-500' },
]

export default function TasksPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useTasksListQuery({ page, limit: 10 })
  const createTask = useCreateTaskMutation()
  const deleteTask = useDeleteTaskMutation()
  
  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />))}</div>
  if (isError) return <div className="text-red-600">Erro ao carregar tarefas</div>

  return (
    <div className="space-y-4 p-4 max-w-screen-lg mx-auto">
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
      <ul className="space-y-4">
        {data?.items.map((t: Task) => (
          <li key={t.id} className="p-4 border rounded flex items-center gap-3 justify-between">
            <div className="flex flex-col justify-between gap-2">
              <Link to="/tasks/$taskId" params={{ taskId: t.id }} className="font-medium hover:underline">{t.title}</Link>
              <div className="flex items-center gap-2">
                <span className={`text-xs text-white px-2 font-semibold py-1 rounded-full ${taskStatuses.find((s) => s.value === t.status)?.className}`}>{taskStatuses.find((s) => s.value === t.status)?.label}</span>
                <span className={`text-xs text-white px-2 font-semibold py-1 rounded-full ${taskPriorities.find((p) => p.value === t.priority)?.className}`}>{taskPriorities.find((p) => p.value === t.priority)?.label}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => deleteTask.mutate(t.id)} variant="destructive" size="icon">
                <X />
              </Button>
            </div>
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


