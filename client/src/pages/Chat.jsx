import { useState } from "react";
import ChatBox from "../components/ChatBox";
import { aiService } from "../services/ai.service";

const QUICK_PROMPTS = [
  "Which role fits my profile best?",
  "Give me a 30-day learning roadmap",
  "What projects should I build first?"
];

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

  const clearChat = () => {
    setMessages([]);
    aiService.saveChatHistory([]);
  };

  return (
    <main className="page-shell chat-hero">
      <section className="surface">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Career chat</span>
            <h1 style={{ marginTop: "0.35rem" }}>Talk to your mentor and get practical next steps.</h1>
            <p className="muted" style={{ marginTop: "0.45rem" }}>
              Ask about roles, skills, projects, and preparation strategy. Keep prompts short for sharper answers.
            </p>
          </div>

          <div className="hero-actions">
            <button type="button" className="btn-secondary" onClick={clearChat}>Clear chat</button>
          </div>
        </div>

        <div className="tag-row" style={{ marginTop: "0.9rem" }}>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="chat-prompt-btn"
              onClick={() => onSend(prompt)}
              disabled={loading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <ChatBox messages={messages} onSend={onSend} loading={loading} />
    </main>
  );
}
