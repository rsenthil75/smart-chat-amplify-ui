import { useState } from 'react';
import { API } from 'aws-amplify';

function App() {
  const [threadId, setThreadId] = useState('');
  const [requestTxt, setRequestTxt] = useState('');
  const [response, setResponse] = useState(null);

  const sendMessage = async () => {
    try {
      const res = await API.post('chatbotAPI', '/chat', {
        body: { thread_id: threadId, input_query: requestTxt },
      });
      setResponse(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <input value={threadId} onChange={(e) => setThreadId(e.target.value)} placeholder="Thread ID" />
      <input value={requestTxt} onChange={(e) => setRequestTxt(e.target.value)} placeholder="Message" />
      <button onClick={sendMessage}>Send</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

export default App;
