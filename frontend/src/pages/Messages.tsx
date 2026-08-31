import { useState, useEffect, useRef } from "react";
import { Search, Paperclip, Send, UserCircle } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const res = await api.get('/messages/conversations/list');
        if (res.data.success) {
          setConversations(res.data.data);
          if (res.data.data.length > 0 && !activeUserId) {
            setActiveUserId(res.data.data[0].user.id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvs();
    
    const interval = setInterval(fetchConvs, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!activeUserId) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeUserId}`);
        if (res.data.success) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
    
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeUserId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!message.trim() || !activeUserId) return;
    const content = message;
    setMessage("");
    
    // Optimistic update
    setMessages(m => [...m, { id: 'temp-'+Date.now(), senderId: user?.id, content, createdAt: new Date().toISOString() }]);

    try {
      await api.post('/messages', { receiverId: activeUserId, content });
    } catch (err) {
      console.error(err);
    }
  };

  const roleType = user?.role === 'MANUFACTURER' ? 'manufacturer' : 'buyer';
  const activeUser = conversations.find(c => c.user.id === activeUserId)?.user;

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType={roleType} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type={roleType} />
        <main className="flex-1 overflow-hidden flex">
          
          {/* Conversation list */}
          <div className="w-64 bg-white border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                <input placeholder="Search conversations" className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-ink-3">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-ink-3">No conversations yet.</div>
              ) : conversations.map((c) => (
                <button
                  key={c.user.id}
                  onClick={() => setActiveUserId(c.user.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left border-b border-border hover:bg-muted transition-colors ${activeUserId === c.user.id ? "bg-brand-50" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.user.companyName ? c.user.companyName.substring(0, 2).toUpperCase() : <UserCircle size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-ink truncate">{c.user.companyName || c.user.name}</p>
                      <span className="text-[10px] text-ink-3 ml-1">{new Date(c.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-[10px] text-ink-3 truncate mt-0.5">{c.lastMessage.content}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col">
            {activeUser ? (
              <>
                <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-3 shadow-sm z-10">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                    {activeUser.companyName ? activeUser.companyName.substring(0, 2).toUpperCase() : <UserCircle size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{activeUser.companyName || activeUser.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-success rounded-full" />
                      <span className="text-xs text-ink-3">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-surface/50">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 ${isMe ? "bg-brand-500 text-white rounded-br-sm" : "bg-white border border-border text-ink rounded-bl-sm shadow-sm"}`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? "text-brand-100" : "text-ink-3"}`}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="bg-white border-t border-border p-3 flex items-center gap-2">
                  <button className="p-2 text-ink-3 hover:text-ink hover:bg-muted rounded-lg transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Type a professional message..."
                    className="flex-1 text-sm px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-surface"
                  />
                  <button
                    onClick={send}
                    disabled={!message.trim()}
                    className="w-10 h-10 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-surface/50 text-ink-3 flex-col gap-4">
                <UserCircle size={48} className="opacity-20" />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
