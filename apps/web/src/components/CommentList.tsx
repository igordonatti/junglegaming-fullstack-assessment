import { useState } from 'react'
import { useCommentsQuery, useCreateCommentMutation } from '../hooks/useCommentsQuery'
import { Input } from './ui/input'
import { Button } from './ui/button'

export function CommentList({ taskId }: { taskId: string }) {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useCommentsQuery(taskId, { page, limit: 10 })
  const createComment = useCreateCommentMutation(taskId)
  const [content, setContent] = useState('')

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="h-8 bg-gray-100 animate-pulse rounded" />))}</div>

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {data?.items.map((c) => (
          <div key={c.id} className="rounded border p-2 text-sm">
            {c.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Novo comentário" />
        <Button onClick={() => { if (content.trim()) { createComment.mutate({ content }); setContent('') } }}>Adicionar</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" disabled={page<=1} onClick={() => setPage((p)=>p-1)}>Anterior</Button>
        <Button variant="outline" disabled={page>=(data?.meta.totalPages ?? 1)} onClick={() => setPage((p)=>p+1)}>Próxima</Button>
      </div>
    </div>
  )
}


