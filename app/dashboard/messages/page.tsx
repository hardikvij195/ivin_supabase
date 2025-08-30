"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Plus, Send, Loader2, MessageSquare, Trash2, ChevronLeft } from "lucide-react";

/** ===== Types aligned to your schema ===== */
type MessageUnit = {
  id: string;
  role: "user" | "assistant" | "system" | string;
  content: string;
  created_at: string;
  /** NEW: who sent it (so we can align left/right correctly) */
  sender_id?: string | null;
};

export type ConversationRow = {
  id: string;                     // row id (uuid)
  user_id: string | null;
  conversation_id: string | null;
  role: string | null;            // legacy/unused
  content: string | null;         // legacy/unused
  metadata: Record<string, any> | null;
  thread: MessageUnit[] | null;   // JSONB array (can be null in schema)
  title: string | null;
  created_at: string;
  updated_at: string | null;
};

/** Helpers */
const newId = () =>
  (crypto as any)?.randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2);

const ensureArray = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);

/** ===== Component ===== */
export default function MessagesPage() {
  // UI
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  // Data
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Compose
  const [draft, setDraft] = useState("");
  const draftRef = useRef<HTMLTextAreaElement | null>(null);

  // Example conversation-level metadata you want to persist
  const [convMetadata] = useState<Record<string, any> | null>({
    source: "web",
    important: false,
  });

  /** Load user + conversation rows */
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: userError } = await supabaseBrowser.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("Not signed in");
        if (cancelled) return;

        setUserId(user.id);

        // One row per conversation
        const { data, error } = await supabaseBrowser
          .from("messages")
          .select("id,user_id,conversation_id,role,content,metadata,thread,title,created_at,updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false, nullsFirst: false });

        if (error) throw error;

        const rows = (data ?? []) as ConversationRow[];
        if (cancelled) return;

        setConversations(rows);

        // Choose most recent as active
        const mostRecent = rows[0]?.conversation_id ?? null;
        setActiveConversation(mostRecent);

        // Broad realtime (new rows / generic updates for your conversations)
        supabaseBrowser
          .channel("messages-row-conversations")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "messages", filter: `user_id=eq.${user.id}` },
            (payload: any) => {
              const row = payload.new as ConversationRow;
              setConversations((prev) => upsertRow(prev, row));
            }
          )
          .subscribe();
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setError(e?.message || "Failed to load conversations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
      try { supabaseBrowser.removeAllChannels(); } catch {}
    };
  }, []);

  /** Focused realtime: subscribe to the ACTIVE conversation row (no user filter)
   *  so if another participant updates the same row, we get it live.
   */
  useEffect(() => {
    if (!activeConversation) return;

    const channel = supabaseBrowser
      .channel(`conv-${activeConversation}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConversation}` },
        (payload: any) => {
          const row = payload.new as ConversationRow;
          setConversations((prev) => upsertRow(prev, row));
        }
      )
      .subscribe();

    return () => {
      try { supabaseBrowser.removeChannel(channel); } catch {}
    };
  }, [activeConversation]);

  /** Active thread (messages) from the selected row — sorted by time */
  const activeThread: MessageUnit[] = useMemo(() => {
    if (!activeConversation) return [];
    const row = conversations.find((c) => c.conversation_id === activeConversation);
    return ensureArray<MessageUnit>(row?.thread).sort(
      (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
    );
  }, [conversations, activeConversation]);

  /** Create a conversation row immediately (so it appears in the list) */
  async function handleNewConversation() {
    if (!userId) return;
    const convId = newId();
    try {
      const now = new Date().toISOString();
      const baseRow: Partial<ConversationRow> = {
        user_id: userId,
        conversation_id: convId,
        title: "New conversation",
        thread: [],
        metadata: convMetadata,
        updated_at: now,
        role: "user", // harmless legacy fill
      };

      const { data, error } = await supabaseBrowser
        .from("messages")
        .insert(baseRow)
        .select()
        .single();
      if (error) throw error;

      const row = data as ConversationRow;
      setConversations((prev) => upsertRow(prev, row));
      setActiveConversation(row.conversation_id);
      setShowListOnMobile(false);
    } catch (e) {
      console.error(e);
      setError("Could not start a new conversation.");
    }
  }

  /** Send message: read row → append to thread → update row */
  async function handleSend() {
    if (!userId) return;

    const content = draft.trim();
    if (!content) return;

    // Ensure we have an active conversation row
    let convId = activeConversation;
    let row = conversations.find((c) => c.conversation_id === convId);

    if (!row) {
      convId = newId();
      const now = new Date().toISOString();
      const baseRow: Partial<ConversationRow> = {
        user_id: userId,
        conversation_id: convId,
        title: "New conversation",
        thread: [],
        metadata: convMetadata,
        updated_at: now,
      };
      const { data, error } = await supabaseBrowser
        .from("messages")
        .insert(baseRow)
        .select()
        .single();
      if (error) {
        console.error(error);
        setError("Could not start a new conversation.");
        return;
      }
      row = data as ConversationRow;
      setConversations((prev) => upsertRow(prev, row!));
      setActiveConversation(convId!);
      setShowListOnMobile(false);
    }

    // Build new message (with sender_id so UI knows who sent it)
    const newMsg: MessageUnit = {
      id: newId(),
      role: "user",
      content,
      created_at: new Date().toISOString(),
      sender_id: userId, // <-- crucial
    };

    setSending(true);
    setError(null);

    // Optimistic UI: append locally
    setConversations((prev) =>
      prev.map((c) =>
        c.conversation_id === row!.conversation_id
          ? {
              ...c,
              thread: [...ensureArray<MessageUnit>(c.thread), newMsg],
              title:
                c.title && c.title !== "New conversation"
                  ? c.title
                  : content.slice(0, 40) + (content.length > 40 ? "…" : ""),
              updated_at: new Date().toISOString(),
            }
          : c
      )
    );
    setDraft("");

    try {
      // Fetch fresh row to avoid overwriting concurrent changes
      const { data: fresh, error: fetchErr } = await supabaseBrowser
        .from("messages")
        .select("id,thread,title,metadata,updated_at")
        .eq("conversation_id", row!.conversation_id)
        .single();
      if (fetchErr) throw fetchErr;

      const freshThread = ensureArray<MessageUnit>(fresh?.thread as MessageUnit[] | null);
      const updatedThread = [...freshThread, newMsg];

      const maybeTitle =
        fresh?.title && fresh.title !== "New conversation"
          ? fresh.title
          : content.slice(0, 40) + (content.length > 40 ? "…" : "");

      const { data: updated, error: updErr } = await supabaseBrowser
        .from("messages")
        .update({
          thread: updatedThread,
          title: maybeTitle,
          metadata: (fresh?.metadata as any) ?? convMetadata,
          updated_at: new Date().toISOString(),
        })
        .eq("conversation_id", row!.conversation_id)
        .select()
        .single();
      if (updErr) throw updErr;

      // Sync local state with DB
      setConversations((prev) => upsertRow(prev, updated as ConversationRow));
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to send message");
      // Roll back optimistic append
      setConversations((prev) =>
        prev.map((c) =>
          c.conversation_id === row!.conversation_id
            ? { ...c, thread: ensureArray<MessageUnit>(c.thread).filter((m) => m.id !== newMsg.id) }
            : c
        )
      );
      setDraft(content);
    } finally {
      setSending(false);
      draftRef.current?.focus();
    }
  }

  /** Delete a conversation = delete its single row */
  async function handleDeleteConversation(conversationId: string) {
    const prev = conversations;
    setConversations((rows) => rows.filter((r) => r.conversation_id !== conversationId));
    if (activeConversation === conversationId) {
      setActiveConversation(prev.find((r) => r.conversation_id !== conversationId)?.conversation_id ?? null);
    }
    try {
      const { error } = await supabaseBrowser
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId);
      if (error) throw error;
    } catch (e) {
      console.error(e);
      // rollback
      setConversations(prev);
    }
  }

  /** Sidebar items */
  const sidebarItems = useMemo(() => {
    return conversations
      .map((c) => {
        const thread = ensureArray<MessageUnit>(c.thread);
        const first = thread[0];
        const last = thread[thread.length - 1];
        const title = c.title || (first?.content ? trimTo(first.content, 40) : "New conversation");
        const preview = last?.content ? trimTo(last.content, 80) : "";
        const lastTs = last ? new Date(last.created_at).getTime() : (c.updated_at ? new Date(c.updated_at).getTime() : new Date(c.created_at).getTime());
        return {
          conversation_id: (c.conversation_id ?? c.id) as string, // fallback to row id if needed
          title,
          preview,
          last_created_at: lastTs,
        };
      })
      .sort((a, b) => b.last_created_at - a.last_created_at);
  }, [conversations]);

  /** ===== UI ===== */
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[320px_1fr] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden my-4">
      {/* Sidebar */}
      <aside className={cn("border-r border-r-gray-200 bg-white p-3 md:p-4", !showListOnMobile && "hidden md:block")}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Conversations
          </h2>
        <Button className="flex justify-center items-center" onClick={handleNewConversation}>
            <Plus className="h-4 w-4 text-white" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-md bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : sidebarItems.length === 0 ? (
          <div className="text-sm text-gray-500">No conversations yet. Start one!</div>
        ) : (
          <ul className="space-y-2">
            {sidebarItems.map((c) => (
              <li key={c.conversation_id}>
                <div
                  className={cn(
                    "w-full text-left rounded-lg border p-3 hover:bg-gray-50 transition flex items-start justify-between gap-2",
                    c.conversation_id === activeConversation && "border-purple-600 bg-purple-50"
                  )}
                  onClick={() => {
                    setActiveConversation(c.conversation_id);
                    setShowListOnMobile(false);
                  }}
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="text-xs text-gray-500 truncate">{c.preview}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] text-gray-400 whitespace-nowrap">
                      {formatTimeAgo(c.last_created_at)}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(c.conversation_id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Chat panel */}
      <section className="flex flex-col h-full md:h-[80vh]">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-b-gray-200 bg-white">
          <Button variant="ghost" size="icon" onClick={() => setShowListOnMobile(true)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-sm font-medium truncate">
            {sidebarItems.find((c) => c.conversation_id === activeConversation)?.title || "New conversation"}
          </div>
          <div className="w-9" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : !activeConversation ? (
            <EmptyState />
          ) : activeThread.length === 0 ? (
            <NoMessagesState />
          ) : (
            activeThread.map((m) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                created_at={m.created_at}
                mine={(m.sender_id ?? null) === userId /* fallback to role if needed */}
                fallbackMine={m.role === "user"}
              />
            ))
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-t-gray-200 bg-white p-3 md:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={draftRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message…"
              className="min-h-[44px] max-h-40 h-12 resize-y"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} disabled={sending || !draft.trim()} aria-label="Send">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-white" />}
            </Button>
          </div>
          {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </div>
      </section>
    </div>
  );
}

/** ===== Small UI bits ===== */
function EmptyState() {
  return (
    <div className="h-full grid place-items-center text-gray-500">
      <div className="text-center">
        <MessageSquare className="mx-auto h-8 w-8 mb-2 text-gray-400" />
        <div className="font-medium">Start a new conversation</div>
        <div className="text-sm">Click “New” to begin</div>
      </div>
    </div>
  );
}

function NoMessagesState() {
  return (
    <div className="h-full grid place-items-center text-gray-500">
      <div className="text-center">
        <div className="font-medium">No messages yet</div>
        <div className="text-sm">Say hello 👋</div>
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  created_at,
  mine,
  fallbackMine,
}: {
  role: string;
  content: string;
  created_at: string;
  mine: boolean;
  fallbackMine: boolean;
}) {
  const isMine = mine ?? fallbackMine;
  return (
    <div className={cn("w-full flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] rounded-2xl border px-3 py-2 text-sm leading-relaxed",
          isMine ? "bg-purple-600 text-white border-purple-600" : "bg-white border-gray-200"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        <div className={cn("mt-1 text-[10px]", isMine ? "text-purple-100" : "text-gray-400")}>
          {new Date(created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

/** ===== Utils ===== */
function upsertRow(list: ConversationRow[], row: ConversationRow) {
  const idx = list.findIndex((r) => r.id === row.id);
  const sorted = (arr: ConversationRow[]) =>
    arr.sort(
      (a, b) =>
        +new Date(b.updated_at ?? b.created_at) - +new Date(a.updated_at ?? a.created_at)
    );

  if (idx === -1) return sorted([row, ...list]);

  const copy = [...list];
  copy[idx] = row;
  return sorted(copy);
}

function trimTo(s: string, n: number) {
  const t = (s || "").replace(/\n/g, " ");
  return t.length > n ? t.slice(0, n) + "…" : t;
}

function formatTimeAgo(ts: number | string) {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
}
