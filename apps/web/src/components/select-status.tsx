import { useUpdateTaskMutation } from "@/hooks/useTaskQuery";
import type { Task, TaskStatus } from "../../../../packages/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { taskStatuses } from "@/types/task-status";

export default function SelectStatus({ task }: { task: Task }) {
  const updateTask = useUpdateTaskMutation(task.id)

    return (
    <Select  value={task.status} disabled={updateTask.isPending} onValueChange={(value) => updateTask.mutate({ status: value as TaskStatus })}>
      <SelectTrigger className="bg-white text-black">
        <SelectValue>
          {taskStatuses.find((s) => s.value === task.status)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {taskStatuses.map((s) => (
          <SelectItem value={s.value} disabled={updateTask.isPending}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}