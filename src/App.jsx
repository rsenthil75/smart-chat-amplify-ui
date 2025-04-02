import { useState } from "react";

function App() {
  const [threadId, setThreadId] = useState("");
  const [query, setQuery] = useState("");
  const [responseAPI, setResponseAPI] = useState(null);

  function sendMessage() {
    const apiUrl = "https://xeymu1cwyh.execute-api.us-east-2.amazonaws.com/dev";
    const payload = {
      thread_id: threadId,
      input_query: query,
    };

    console.log(payload);

    fetch(apiUrl, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error! Status: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        const responseBody = JSON.parse(data.body);

        setResponseAPI(responseBody.answer);
        setThreadId(responseBody.thread_id);

        console.log("Answer:", responseBody.answer);
        console.log("Thread ID:", responseBody.thread_id);
      })
      .catch((error) => {
        console.error("Trying again:", error);
        new Promise((resolve) => setTimeout(resolve, 240000));
        fetch(apiUrl, {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("HTTP error! Status: " + response.status);
            }
            return response.json();
          })
          .then((data) => {
            const responseBody = JSON.parse(data.body);

            setResponseAPI(responseBody.answer);
            setThreadId(responseBody.thread_id);

            console.log("Answer:", responseBody.answer);
            console.log("Thread ID:", responseBody.thread_id);
          })
          .catch((error) => {
            console.error("Still got error:", error);
          });
      });
  }

  return (
    <div>
      <h1>Chatbot</h1>
      <input
        value={threadId}
        onChange={(e) => setThreadId(e.target.value)}
        placeholder="Thread ID"
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Message"
      />
      <button onClick={sendMessage}>Send</button>
      {responseAPI && <pre>{JSON.stringify(responseAPI, null, 2)}</pre>}
    </div>
  );
}

export default App;
