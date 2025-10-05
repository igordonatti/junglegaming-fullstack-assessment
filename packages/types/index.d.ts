export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    REVIEW = "REVIEW",
    DONE = "DONE"
}
export declare enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
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
    dueDate: string | null;
    creatorId: string;
    assigneeIds: string[];
    createdAt: string;
    updatedAt: string;
}
export interface Comment {
    id: string;
    content: string;
    authorId: string;
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
};
export interface PaginatedResponse<T> {
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
