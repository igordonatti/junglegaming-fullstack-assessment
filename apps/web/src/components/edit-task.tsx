import { Dialog, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { TaskForm } from "./TaskForm";
import { DialogContent } from "./ui/dialog";
import { useUpdateTaskMutation } from "@/hooks/useTaskQuery";
import type { Task } from "../../../../packages/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import type { UpdateTaskPayload } from "../../../../packages/types";

export default function EditTask({ task }: { task: Task }) {
  const updateTask = useUpdateTaskMutation(task.id)
  const [open, setOpen] = useState(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent>
          <DialogTitle>Editar tarefa</DialogTitle>
          <TaskForm
            initial={task}
            onSubmit={(values) =>
              updateTask.mutate(values as UpdateTaskPayload, {
                onSuccess: () => setOpen(false),
              })
            }
          />
        </DialogContent>
    </Dialog>
  )
}