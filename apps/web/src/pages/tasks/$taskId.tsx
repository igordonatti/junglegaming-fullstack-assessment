import { useParams } from '@tanstack/react-router'
import { useTaskDetailQuery, useUpdateTaskMutation } from '../../hooks/useTaskQuery'
import { CommentList } from '../../components/CommentList'
import { TaskForm } from '../../components/TaskForm'
import { Dialog, DialogTrigger, DialogContent } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'

export default function TaskDetailPage() {
  const params = useParams({ from: '/tasks/$taskId' as never }) as { taskId: string }
  const { data, isLoading, isError } = useTaskDetailQuery(params.taskId)

  const updateTask = useUpdateTaskMutation(params.taskId)

  if (isLoading) return <div className="h-32 bg-gray-100 animate-pulse rounded" />
  if (isError || !data) return <div className="text-red-600">Erro ao carregar tarefa</div>

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{data.title}</h2>
          <p className="text-sm text-muted-foreground">{data.description}</p>
          <div className="text-xs">Status: {data.status} • Prioridade: {data.priority}</div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Editar</Button>
          </DialogTrigger>
          <DialogContent>
            <h3 className="text-lg font-medium mb-3">Editar tarefa</h3>
            <TaskForm initial={data} onSubmit={(values) => updateTask.mutate(values)} />
          </DialogContent>
        </Dialog>
      </div>

      <section>
        <h3 className="mb-2 font-medium">Comentários</h3>
        <CommentList taskId={params.taskId} />
      </section>
    </div>
  )
}


