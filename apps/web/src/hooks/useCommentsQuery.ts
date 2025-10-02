import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, createComment } from "../api/tasks";

export function useCommentsQuery(
  taskId: string,
  params: { page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["comments", taskId, params],
    queryFn: () => getComments(taskId, params),
    enabled: Boolean(taskId),
  });
}

export function useCreateCommentMutation(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createComment>[1]) =>
      createComment(taskId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
