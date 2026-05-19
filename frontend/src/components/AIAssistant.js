import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIAssistant() {
  const [apiKey, setApiKey] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I'm your AI Interview Tutor. I can generate mock questions, evaluate your answers, or explain complex technical concepts. What would you like to study today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const key = localStorage.getItem('GEMINI_API_KEY');
    setApiKey(key);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: "You are an expert technical interviewer and study tutor. Help the user prepare for software engineering and data engineering interviews. Provide concise, accurate, and encouraging responses. When providing code, use markdown code blocks.",
      });

      // Format previous messages for chat history
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMessage.text);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      let errorMessage = "Sorry, I encountered an error communicating with the AI service. ";
      
      if (error.message?.includes('API key not valid')) {
        errorMessage += "Your API key appears to be invalid.";
      } else {
        errorMessage += error.message || "Please check your network and API key.";
      }
      
      setMessages(prev => [...prev, { role: 'model', text: `❌ **Error**: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="section-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Tutor Not Configured</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Please add your Gemini API Key in the settings to start chatting with the AI Tutor.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/settings')}>
          ⚙️ Go to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="section-card ai-assistant-card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', padding: '1.5rem' }}>
      <h2 className="section-title" style={{ marginBottom: '1rem', flexShrink: 0 }}>
        <span className="section-title-emoji">🤖</span> AI Tutor
      </h2>
      
      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message-wrapper ${msg.role === 'user' ? 'chat-message-right' : 'chat-message-left'}`}>
            {msg.role === 'model' && <div className="chat-avatar model-avatar">🤖</div>}
            <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-model'}`}>
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message-wrapper chat-message-left">
            <div className="chat-avatar model-avatar">🤖</div>
            <div className="chat-bubble chat-bubble-model chat-loading">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="form-control chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me a question or request a mock interview..."
          disabled={isLoading}
        />
        <button type="submit" className="btn btn-primary chat-send-btn" disabled={isLoading || !input.trim()}>
          {isLoading ? '⏳' : 'Send'}
        </button>
      </form>
    </div>
  );
}
