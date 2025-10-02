import { axiosInstance } from "../lib/axios";
import type {
  Task,
  Comment,
  CreateTaskPayload,
  UpdateTaskPayload,
  CreateCommentPayload,
  PaginatedResponse,
} from "@repo/types";

export async function getTasks(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
}) {
  const { data } = await axiosInstance.get("/tasks", { params });
  return data as PaginatedResponse<Task>;
}

export async function getTask(id: string) {
  const { data } = await axiosInstance.get(`/tasks/${id}`);
  return data as Task;
}

export async function createTask(payload: CreateTaskPayload) {
  const { data } = await axiosInstance.post("/tasks", payload);
  return data as Task;
}

export async function updateTask(id: string, payload: UpdateTaskPayload) {
  const { data } = await axiosInstance.put(`/tasks/${id}`, payload);
  return data as Task;
}

export async function deleteTask(id: string) {
  const { data } = await axiosInstance.delete(`/tasks/${id}`);
  return data as { success: boolean };
}

export async function createComment(
  taskId: string,
  payload: CreateCommentPayload
) {
  const { data } = await axiosInstance.post(
    `/tasks/${taskId}/comments`,
    payload
  );
  return data as Comment;
}

export async function getComments(
  taskId: string,
  params: { page?: number; limit?: number }
) {
  const { data } = await axiosInstance.get(`/tasks/${taskId}/comments`, {
    params,
  });
  return data as PaginatedResponse<Comment>;
}
