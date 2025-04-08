"use client";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = "rakesh"; // Hardcoded user ID

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://localhost:3004/ws/rag-service/${userId}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // Empty dependency array since userId is hardcoded

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: inputMessage, sender: "user" }]);

    // Prepare the query message
    const queryMessage = {
      request_type: "query",
      query: inputMessage,
    };

    // Send message through WebSocket
    if (socket && isConnected) {
      socket.send(JSON.stringify(queryMessage));
    }

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <h2>RAG Chatbot</h2>
        <p>{isConnected ? "Connected" : "Connecting..."}</p>
      </div>

      {/* Messages area */}
      <div className="messages-area">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === "bot" && (
              <div className="avatar bot-avatar">B</div>
            )}
            <div className={`message-bubble ${message.sender}`}>
              {message.text}
            </div>
            {message.sender === "user" && (
              <div className="avatar user-avatar">U</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="input-area text-black">
        <textarea
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || inputMessage.trim() === ""}
        >
          Send
        </button>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 80vh;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }

        .chat-header {
          background-color: #1976d2;
          color: white;
          padding: 16px;
          text-align: center;
        }

        .chat-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .chat-header p {
          margin: 4px 0 0;
          font-size: 0.75rem;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background-color: #f5f5f5;
        }

        .message {
          display: flex;
          padding: 8px 16px;
          margin-bottom: 8px;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.bot {
          justify-content: flex-start;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          margin: 0 8px;
        }

        .bot-avatar {
          background-color: #1976d2;
        }

        .user-avatar {
          background-color: #dc004e;
        }

        .message-bubble {
          padding: 8px 16px;
          max-width: 70%;
          border-radius: 18px;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .message-bubble.user {
          background-color: #1976d2;
          color: white;
          border-radius: 18px 18px 0 18px;
        }

        .message-bubble.bot {
          background-color: white;
          color: black;
          border-radius: 18px 18px 18px 0;
        }

        .input-area {
          display: flex;
          padding: 16px;
          background-color: white;
          border-top: 1px solid #e0e0e0;
        }

        .input-area textarea {
          flex: 1;
          padding: 8px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          resize: none;
          margin-right: 8px;
          min-height: 40px;
          max-height: 120px;
        }

        .input-area button {
          padding: 8px 16px;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .input-area button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
