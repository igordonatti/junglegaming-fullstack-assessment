// Exemplo de como devem ser os tipos no seu pacote @repo/types
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // Use string para datas e formate no frontend
  creatorId: string; // ID do criador
  assigneeIds: User[]; // Lista de IDs de usuários atribuídos
  // Lista de usuários atribuídos retornados pelo backend em detalhes da tarefa
  // Este campo é opcional porque nem todas as rotas retornam os dados populados
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string; // ID do autor do comentário
  taskId: string;
  createdAt: string;
}

export type CreateTaskPayload = {
  title: string;
  description?: string;
  priority: TaskPriority;
};

export type UpdateTaskPayload = Partial<CreateTaskPayload> & {
  status?: TaskStatus;
  assigneeIds?: string[];
  dueDate?: string | null;
};

export type CreateCommentPayload = {
  content: string;
  taskId: string;
  authorId: string;
};

export interface PaginatedResponse<T> {
  // Estrutura de resposta paginada
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}
