import { useState } from "react";

export default function ChatBox({ messages, onSend, loading }) {
  const [input, setInput] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }
    await onSend(input.trim());
    setInput("");
  };

  return (
    <div className="chat-shell">
      <div className="chat-messages" aria-live="polite">
        {messages.length === 0 && (
          <p className="muted">Ask about roles, required skills, roadmap, or project ideas.</p>
        )}

        {messages.map((msg) => (
          <article key={msg.id} className={`chat-bubble ${msg.role}`}>
            <p>{msg.content}</p>
          </article>
        ))}

        {loading && <article className="chat-bubble ai"><p>Thinking...</p></article>}
      </div>

      <form className="chat-input" onSubmit={submit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your question..."
          aria-label="Career chat prompt"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}