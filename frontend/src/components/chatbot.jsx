import { useState } from "react";
import { sendMessage } from "../api/chatbot";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const data = await sendMessage(message, updatedMessages);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Backend connection failed.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>Interactive Skill Enhancer AI</h2>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}

        {loading && <p>Thinking...</p>}
      </div>

      <input
        type="text"
        value={message}
        placeholder="Ask anything..."
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "80%", padding: "10px" }}
      />

      <button
        onClick={handleSend}
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        Send
      </button>
    </div>
  );
}