import { axiosInstance } from "../lib/axios";
import type {
  Task,
  Comment,
  CreateTaskPayload,
  UpdateTaskPayload,
  CreateCommentPayload,
  PaginatedResponse,
  User,
} from "../../../../packages/types/index";

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
  console.log("createTask", payload);
  const { data } = await axiosInstance.post("/tasks", payload);
  return data as Task;
}

export async function updateTask(id: string, payload: UpdateTaskPayload) {
  console.log("updateTask", id, payload);
  const { data } = await axiosInstance.put(`/tasks?taskId=${id}`, payload);
  return data as Task;
}

export async function deleteTask(id: string) {
  const { data } = await axiosInstance.delete(`/tasks?taskId=${id}`);
  return data as { success: boolean };
}

export async function createComment(
  taskId: string,
  payload: CreateCommentPayload
) {
  console.log("createComment", payload);
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

// USERS
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data } = await axiosInstance.get(`/auth/users`, { params });
  if (Array.isArray(data)) return data as User[];
  if (data && Array.isArray(data.items)) return data.items as User[];
  return [] as User[];
}
