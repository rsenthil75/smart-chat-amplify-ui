import { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [threadId, setThreadId] = useState(null);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  async function sendMessage() {
    if (!query.trim()) return;

    const apiUrl = "https://xeymu1cwyh.execute-api.us-east-2.amazonaws.com/dev";
    const payload = {
      input_query: query,
      thread_id: threadId ?? "none", // 👈 "none" for first request
    };

    // Add user message
    setChatHistory((prev) => [...prev, { role: "user", text: query }]);
    setQuery("");

    try {
      const response = await fetch(apiUrl, {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const responseBody =
        typeof data.body === "string" ? JSON.parse(data.body) : data.body;

      console.log("API raw data:", data);
      console.log("Parsed response body:", responseBody);

      if (!responseBody?.thread_id || !responseBody?.answer) {
        throw new Error("Invalid API response format.");
      }

      setThreadId(responseBody.thread_id);

      // Add bot response
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", text: responseBody.answer },
      ]);
    } catch (error) {
      console.error("Trying Again:", error);
      try {
        const response = await fetch(apiUrl, {
          mode: "cors",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const responseBody =
          typeof data.body === "string" ? JSON.parse(data.body) : data.body;

        console.log("API raw data:", data);
        console.log("Parsed response body:", responseBody);

        if (!responseBody?.thread_id || !responseBody?.answer) {
          throw new Error("Invalid API response format.");
        }

        setThreadId(responseBody.thread_id);

        // Add bot response
        setChatHistory((prev) => [
          ...prev,
          { role: "bot", text: responseBody.answer },
        ]);
      } catch (error) {
        console.error("Still Error:", error);
        setChatHistory((prev) => [
          ...prev,
          { role: "bot", text: "❌ Something went wrong. Please try again." },
        ]);
      }
    }
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h2>Chatbot</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
          borderRadius: "5px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "10px",
                background: msg.role === "user" ? "#007bff" : "#e9ecef",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your message..."
        rows={3}
        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
