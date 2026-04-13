import { useState } from "react";

export default function ChatBox({ messages, onSend, loading }) {
  const [input, setInput] = useState("");
  const canSubmit = input.trim().length > 0 && !loading;

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    await onSend(input.trim());
    setInput("");
  };

  return (
    <div className="chat-shell">
      <div className="chat-messages" aria-live="polite">
        {messages.length === 0 && (
          <article className="chat-empty">
            <h3>No messages yet</h3>
            <p className="muted">Try asking about role options, required skills, roadmap planning, or project ideas.</p>
          </article>
        )}

        {messages.map((msg) => (
          <article key={msg.id} className={`chat-bubble ${msg.role}`}>
            <p>{msg.content}</p>
          </article>
        ))}

        {loading && <article className="chat-bubble ai"><p>Thinking...</p></article>}
      </div>

      <form className="chat-input" onSubmit={submit}>
        <div className="chat-input-wrap">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your question..."
            aria-label="Career chat prompt"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}