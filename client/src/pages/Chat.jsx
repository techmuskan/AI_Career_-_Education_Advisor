import { useState } from "react";
import ChatBox from "../components/ChatBox";
import { aiService } from "../services/ai.service";

export default function Chat() {
  const [messages, setMessages] = useState(aiService.getChatHistory());
  const [loading, setLoading] = useState(false);

  const onSend = async (content) => {
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString()
    };

    const optimistic = [...messages, userMsg];
    setMessages(optimistic);
    aiService.saveChatHistory(optimistic);

    setLoading(true);
    try {
      const response = await aiService.chatWithAI(content);
      const aiMsg = {
        id: crypto.randomUUID(),
        role: "ai",
        content: response,
        createdAt: new Date().toISOString()
      };
      const updated = [...optimistic, aiMsg];
      setMessages(updated);
      aiService.saveChatHistory(updated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Career Mentor Chat</h1>
        <p className="muted">Ask about roles, skills, projects, and next-step roadmap planning.</p>
      </section>
      <ChatBox messages={messages} onSend={onSend} loading={loading} />
    </main>
  );
}
