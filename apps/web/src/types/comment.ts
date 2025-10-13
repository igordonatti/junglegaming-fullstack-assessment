import type { Comment, User } from "../../../../packages/types/index";

export interface CommentWithAuthor extends Comment {
  author?: User;
}

export interface Paginated<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
