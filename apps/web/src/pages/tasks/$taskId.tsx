import { useParams } from '@tanstack/react-router'
import { useTaskDetailQuery } from '../../hooks/useTaskQuery'
import { CommentList } from '@/components/comment-list'
import EditTask from '@/components/edit-task'
import SelectPriority from '@/components/select-priority'
import SelectStatus from '@/components/select-status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TaskDetailPage() {
  const params = useParams({ from: '/tasks/$taskId' as never }) as { taskId: string }
  const { data, isLoading, isError } = useTaskDetailQuery(params.taskId)

  console.log(data)

  if (isLoading) return <div className="h-32 bg-gray-100 animate-pulse rounded" />
  if (isError || !data) return <div className="text-red-600">Erro ao carregar tarefa</div>

  return (
    <div className="space-y-4 p-4 max-w-screen-lg mx-auto">
      <div className="flex flex-col items-start justify-between bg-amber-700 w-ful rounded-lg py-4">
        <div className='flex items-center justify-between w-full p-4'>
          <div className='flex flex-col gap-2 max-w-10/12'>
            <h2 className="text-xl font-semibold text-white">{data.title}</h2>
            <p className="text-sm text-white">{data.description}</p>
          </div>
          <EditTask task={data} />
        </div>
       
        <div className="flex items-center gap-2 bg-amber-500 w-full p-2">
          <div className="text-sm  font-semibold flex items-center gap-2">
            <SelectStatus task={data} />
            <SelectPriority task={data} />
          </div>
        </div>
      </div>

      {/* Assignees */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Atribuída para</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(data.assigneeIds) && data.assigneeIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.assigneeIds.map((user: { id: string; username: string; email: string }) => (
                  <div key={user.id} className="flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-3 py-1">
                    <div className="size-6 rounded-full bg-amber-300 text-amber-900 flex items-center justify-center text-xs font-semibold">
                      {user.username?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.username || user.email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem usuários atribuídos</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="mb-2 font-medium">Comentários</h3>
        <CommentList taskId={params.taskId} />
      </section>
    </div>
  )
}


