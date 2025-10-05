import { X } from 'lucide-react'
import type { Task } from '../../../../packages/types/index'
import { Button } from './ui/button'
import { useDeleteTaskMutation } from '@/hooks/useTaskQuery'
import { Link } from '@tanstack/react-router'
import { Card } from './ui/card'
import { taskPriorities } from '@/types/task-status'
import SelectStatus from './select-status'

export default function TaskCard({ task }: { task: Task }) {
  const deleteTask = useDeleteTaskMutation()
  return (
    <Card key={task.id} className="flex w-full flex-row p-4 gap-3 justify-between">
      <div className="flex flex-col justify-between gap-2">
        <Link to="/tasks/$taskId" params={{ taskId: task.id }} className="font-medium hover:underline">{task.title}</Link>
        <div className="flex items-center gap-2">
          <span className={`text-xs text-white px-2 font-semibold py-1 rounded-full ${taskPriorities.find((p) => p.value === task.priority)?.className}`}>{taskPriorities.find((p) => p.value === task.priority)?.label}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SelectStatus task={task} />
        <Button onClick={() => deleteTask.mutate(task.id)} variant="destructive" size="icon">
          <X />
        </Button>
      </div>
    </Card>
)
}