import { taskPriorities } from "@/types/task-status";
import type { Task, TaskPriority } from "../../../../packages/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useUpdateTaskMutation } from "@/hooks/useTaskQuery";

export default function SelectPriority({ task }: { task: Task }) {
  const updateTask = useUpdateTaskMutation(task.id)

  return (
    <Select  value={task.priority} disabled={updateTask.isPending} onValueChange={(value) => updateTask.mutate({ priority: value as TaskPriority })}>
      <SelectTrigger className="bg-white text-black">
        <SelectValue>
          {taskPriorities.find((p) => p.value === task.priority)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {taskPriorities.map((p) => (
          <SelectItem value={p.value} disabled={updateTask.isPending}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}