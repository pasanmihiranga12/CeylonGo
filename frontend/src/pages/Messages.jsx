import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import messageService from '../services/messageService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { initials, formatRelativeDateTime } from '../utils/format'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeUserId, setActiveUserId] = useState(null)
  const [thread, setThread] = useState([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    messageService
      .getConversations()
      .then((data) => {
        setConversations(data)
        if (data.length > 0) setActiveUserId(data[0].otherUserId)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!activeUserId) return
    messageService.getConversationWith(activeUserId).then(setThread)
  }, [activeUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  async function handleSend(e) {
    e.preventDefault()
    if (!draft.trim()) return
    const sent = await messageService.send({ receiverId: activeUserId, content: draft })
    setThread((prev) => [...prev, sent])
    setDraft('')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl">Messages</h1>
      <p className="mt-3 text-ink-700">Conversations between you and {user.role === 'GUIDE' ? 'travellers' : 'guides'}.</p>

      {conversations.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No conversations yet"
            description="Messages you send to or receive from guides will appear here."
          />
        </div>
      ) : (
        <div className="mt-10 grid overflow-hidden rounded-3xl bg-white shadow-soft md:grid-cols-3">
          <div className="border-r border-jungle-950/5 md:col-span-1">
            {conversations.map((c) => (
              <button
                key={c.otherUserId}
                onClick={() => setActiveUserId(c.otherUserId)}
                className={`flex w-full items-center gap-3 border-b border-jungle-950/5 px-5 py-4 text-left ${
                  c.otherUserId === activeUserId ? 'bg-jungle-700/5' : 'hover:bg-ivory-50'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jungle-700/10 text-xs font-semibold text-jungle-900">
                  {initials(c.otherUserName)}
                </span>
                <span className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.otherUserName}</p>
                  <p className="truncate text-xs text-ink-700/60">{c.lastMessage}</p>
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:col-span-2">
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5" style={{ maxHeight: '480px' }}>
              {thread.map((m) => {
                const mine = m.senderId === user.id
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-jungle-700 text-ivory-50' : 'bg-ivory-100 text-ink-900'}`}>
                      <p>{m.content}</p>
                      <p className={`mt-1 text-[10px] ${mine ? 'text-ivory-50/60' : 'text-ink-700/50'}`}>
                        {formatRelativeDateTime(m.sentAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-jungle-950/5 p-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                className="input"
              />
              <button type="submit" className="btn-primary shrink-0 !px-4 !py-3">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
