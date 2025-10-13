import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, createComment } from "../api/tasks";
import { getCurrentUserId } from "../lib/auth-helpers";
import type { CommentWithAuthor, Paginated } from "@/types/comment";
import type { Comment as CommentEntity } from "../../../../packages/types/index";

type CreateCommentInput = { content: string };

export function useCommentsQuery(
  taskId: string,
  params: { page?: number; limit?: number } = {}
) {
  return useQuery<Paginated<CommentWithAuthor>>({
    queryKey: ["comments", taskId, params],
    queryFn: () => getComments(taskId, params),
    enabled: Boolean(taskId),
  });
}

export function useCreateCommentMutation(taskId: string) {
  const qc = useQueryClient();
  return useMutation<CommentEntity, unknown, CreateCommentInput>({
    mutationFn: (payload: CreateCommentInput) => {
      const authorId = getCurrentUserId();
      return createComment(taskId, {
        content: payload.content,
        taskId,
        authorId: authorId ?? "",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
