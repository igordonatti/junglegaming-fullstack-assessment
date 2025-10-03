import { X } from 'lucide-react'
import type { Task, TaskStatus } from '../../../../packages/types/index'
import { Button } from './ui/button'
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/hooks/useTaskQuery'
import { Link } from '@tanstack/react-router'
import { Card } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { taskStatuses, taskPriorities } from '@/types/task-status'

export default function TaskCard({ task }: { task: Task }) {
  const deleteTask = useDeleteTaskMutation()
  const updateTask = useUpdateTaskMutation(task.id)
  return (
    <Card key={task.id} className="flex w-full flex-row p-4 gap-3 justify-between">
      <div className="flex flex-col justify-between gap-2">
        <Link to="/tasks/$taskId" params={{ taskId: task.id }} className="font-medium hover:underline">{task.title}</Link>
        <div className="flex items-center gap-2">
          <span className={`text-xs text-white px-2 font-semibold py-1 rounded-full ${taskPriorities.find((p) => p.value === task.priority)?.className}`}>{taskPriorities.find((p) => p.value === task.priority)?.label}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Select value={task.status} onValueChange={(value) => updateTask.mutate({ status: value as TaskStatus })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            {taskStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <span className={`text-xs text-white px-2 font-semibold py-1 rounded-full ${s.className}`}>{s.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => deleteTask.mutate(task.id)} variant="destructive" size="icon">
          <X />
        </Button>
      </div>
    </Card>
)
}