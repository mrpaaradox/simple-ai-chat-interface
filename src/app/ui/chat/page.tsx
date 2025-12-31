/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on all devices, will open programmatically for desktop
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isRegeneratingStreaming, setIsRegeneratingStreaming] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null);
  const [regeneratedMessageId, setRegeneratedMessageId] = useState<string | null>(null);
  const { messages, sendMessage, status, error, stop, setMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(true);
  
  // Open sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Model name from backend
  const modelName = "Kimi K2 Instruct";

  // Handle new chat - clear everything to start fresh
  const handleNewChat = () => {
    // Clear messages from useChat hook
    setMessages([]);
    // Clear local state
    setInput("");
    setCopiedId(null);
    setLikedMessages(new Set());
    setDislikedMessages(new Set());
    setIsRegenerating(false);
    setIsRegeneratingStreaming(false);
    setRegeneratingMessageId(null);
    setRegeneratedMessageId(null);
    // Focus input
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
      isAutoScrollingRef.current = true;
    }
  };

  // Smooth auto-scroll during streaming
  useEffect(() => {
    if (!isAutoScrollingRef.current) return;
    
    if (status === "streaming") {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    } else if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, status]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Copy message to clipboard
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get message text content
  const getMessageText = (message: typeof messages[0]) => {
    return message.parts
      .filter(part => part.type === "text")
      .map(part => (part as any).text)
      .join("");
  };

  // Handle like/dislike
  const handleLike = (messageId: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // Remove from disliked if it was disliked
        setDislikedMessages(prevDisliked => {
          const newDisliked = new Set(prevDisliked);
          newDisliked.delete(messageId);
          return newDisliked;
        });
      }
      return newSet;
    });
  };

  const handleDislike = (messageId: string) => {
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // Remove from liked if it was liked
        setLikedMessages(prevLiked => {
          const newLiked = new Set(prevLiked);
          newLiked.delete(messageId);
          return newLiked;
        });
      }
      return newSet;
    });
  };

  // Regenerate response - remove old AI response and generate new one
  const handleRegenerate = async (messageId: string) => {
    if (status !== "ready") return;
    
    // Find the assistant message to regenerate
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].role !== "assistant") return;
    
    // Set regenerating state
    setIsRegenerating(true);
    setRegeneratingMessageId(messageId);
    
    // Remove only the assistant message (keep user message visible)
    const messagesWithoutAssistant = messages.slice(0, messageIndex);
    
    // Remove old assistant message - loading dots will show
    setMessages(messagesWithoutAssistant);
    
    // Create placeholder ID for tracking
    const placeholderId = `regen-${Date.now()}`;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesWithoutAssistant }),
      });

      if (!response.ok) throw new Error('Failed to regenerate');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No reader available');

      let buffer = '';
      let accumulatedText = '';
      let messageAdded = false;
      const actualMessageId = placeholderId; // Track the actual message ID being used
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          // SSE format: data: {"type":"text-delta","id":"txt-0","delta":"Hello"}
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6); // Remove "data: " prefix
            
            // Skip [DONE] marker
            if (jsonStr === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(jsonStr);
              
              // Handle text-delta events - these contain the actual text
              if (parsed.type === 'text-delta' && parsed.delta) {
                accumulatedText += parsed.delta;
                
                // First chunk: add the message and hide loading dots
                if (!messageAdded) {
                  messageAdded = true;
                  setRegeneratedMessageId(actualMessageId);
                  setIsRegeneratingStreaming(true); // Hide loading dots
                  
                  // Add new message with first text
                  setMessages(prev => [...prev, {
                    id: actualMessageId,
                    role: 'assistant',
                    parts: [{ type: 'text', text: accumulatedText }],
                  }]);
                } else {
                  // Subsequent chunks: update existing message
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.findIndex(m => m.id === actualMessageId);
                    if (lastIndex >= 0) {
                      updated[lastIndex] = {
                        ...updated[lastIndex],
                        parts: [{ type: 'text', text: accumulatedText }],
                      };
                    }
                    return updated;
                  });
                }
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
      
      // Process any remaining buffer
      if (buffer.trim() && buffer.startsWith('data: ')) {
        const jsonStr = buffer.substring(6);
        if (jsonStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.type === 'text-delta' && parsed.delta) {
              accumulatedText += parsed.delta;
              
              if (!messageAdded) {
                messageAdded = true;
                setRegeneratedMessageId(actualMessageId);
                setIsRegeneratingStreaming(true);
                setMessages(prev => [...prev, {
                  id: actualMessageId,
                  role: 'assistant',
                  parts: [{ type: 'text', text: accumulatedText }],
                }]);
              } else {
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIndex = updated.findIndex(m => m.id === actualMessageId);
                  if (lastIndex >= 0) {
                    updated[lastIndex] = {
                      ...updated[lastIndex],
                      parts: [{ type: 'text', text: accumulatedText }],
                    };
                  }
                  return updated;
                });
              }
            }
          } catch (e) {
            // Ignore
          }
        }
      }
      
    } catch (error) {
      console.error('Regenerate error:', error);
    } finally {
      setIsRegenerating(false);
      setIsRegeneratingStreaming(false);
      setRegeneratingMessageId(null);
      setRegeneratedMessageId(null);
    }
  };

  // Detect manual scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      isAutoScrollingRef.current = isNearBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex h-screen bg-white dark:bg-[#212121]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shrink-0 
        lg:relative fixed lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        inset-y-0 left-0 z-50`}
      >
        <div className="flex flex-col h-full p-2">
          {/* Sidebar Header - AI Logo */}
          <div className={`flex items-center mb-2 ${sidebarOpen ? 'justify-start px-2' : 'justify-center'}`}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-colors"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span className="text-lg font-semibold">AI</span>
            </button>
          </div>

          {/* New Chat Button */}
          {sidebarOpen ? (
            <button 
              onClick={handleNewChat}
              className="w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 mb-4 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New chat
            </button>
          ) : (
            <button 
              onClick={handleNewChat}
              className="w-10 h-10 mx-auto rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer mb-4"
              title="New chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* User Profile */}
          <div className={`border-t border-zinc-200 dark:border-zinc-800 pt-2 ${sidebarOpen ? '' : 'flex justify-center'}`}>
            {sidebarOpen ? (
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                  U
                </div>
                <span>User</span>
              </Link>
            ) : (
              <Link href="/" className="w-10 h-10 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer" title="User">
                <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                  U
                </div>
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#212121]">
          <div className="flex items-center justify-start h-14 px-4 gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
              title="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm font-medium">{modelName}</span>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
          </div>
        )}

        {/* Messages Container */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto relative">
          {messages.length === 0 ? (
            // Empty State - Input will be centered here
            <div className="flex flex-col items-center justify-center h-full px-4">
              {/* This is just for spacing, input will be rendered separately */}
            </div>
          ) : (
            // Messages
            <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
              {messages.map((message) => (
                <div key={message.id} className="mb-6 sm:mb-8">
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    {/* Avatar */}
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                      {message.role === "assistant" ? (
                        <span className="text-xs sm:text-sm font-semibold">AI</span>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium">U</span>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
                        {message.parts.map((part, index) => {
                          if (part.type === "text") {
                            return (
                              <span key={`${message.id}-${index}`}>
                                {part.text}
                                {((status === "streaming" && message.id === messages[messages.length - 1]?.id) || 
                                  (isRegeneratingStreaming && message.id === regeneratedMessageId)) && 
                                 message.role === "assistant" && 
                                 index === message.parts.length - 1 && (
                                  <span className="inline-block w-1.5 h-4 sm:h-5 bg-zinc-800 dark:bg-zinc-200 ml-0.5 animate-pulse"></span>
                                )}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      {/* Action Buttons (only for assistant messages) */}
                      {message.role === "assistant" && 
                       !(status === "streaming" && message.id === messages[messages.length - 1]?.id) && 
                       !(isRegeneratingStreaming && message.id === regeneratedMessageId) && (
                        <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                          <button 
                            onClick={() => copyToClipboard(getMessageText(message), message.id)}
                            className="p-1 sm:p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative group" 
                            title="Copy"
                          >
                            {copiedId === message.id ? (
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {copiedId === message.id ? "Copied!" : "Copy"}
                            </span>
                          </button>
                          <button 
                            onClick={() => handleLike(message.id)}
                            className={`p-1 sm:p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative group transition-all ${
                              likedMessages.has(message.id) 
                                ? 'bg-white dark:bg-zinc-700 shadow-sm' 
                                : ''
                            }`}
                            title="Good response"
                          >
                            <svg 
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                                likedMessages.has(message.id) 
                                  ? 'fill-green-600 stroke-green-600' 
                                  : 'fill-none stroke-current'
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Good response
                            </span>
                          </button>
                          <button 
                            onClick={() => handleDislike(message.id)}
                            className={`p-1 sm:p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative group transition-all ${
                              dislikedMessages.has(message.id) 
                                ? 'bg-white dark:bg-zinc-700 shadow-sm' 
                                : ''
                            }`}
                            title="Bad response"
                          >
                            <svg 
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                                dislikedMessages.has(message.id) 
                                  ? 'fill-red-600 stroke-red-600' 
                                  : 'fill-none stroke-current'
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Bad response
                            </span>
                          </button>
                          <button 
                            onClick={() => handleRegenerate(message.id)}
                            disabled={status !== "ready" || isRegenerating}
                            className="p-1 sm:p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative group disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Regenerate"
                          >
                            <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRegenerating && regeneratingMessageId === message.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Regenerate
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {((status === "submitted" && messages.length > 0 && messages[messages.length - 1].role === "user") || (isRegenerating && !isRegeneratingStreaming)) && (
                <div className="mb-6 sm:mb-8">
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                      <span className="text-xs sm:text-sm font-semibold">AI</span>
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      <div className="w-2 h-2 bg-zinc-500 dark:bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-zinc-500 dark:bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-zinc-500 dark:bg-zinc-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Centered when empty, bottom when has messages */}
        {messages.length === 0 && (
          // Centered Input (Initial State) - Positioned in messages container
          <div className="absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 pointer-events-none z-10">
            <div className="w-full max-w-3xl pointer-events-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-zinc-900 dark:text-zinc-100 mb-6 sm:mb-8 text-center px-2">
                What&apos;s on the agenda today?
              </h1>
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-end gap-2 p-2 border border-zinc-300 dark:border-zinc-700 rounded-3xl bg-white dark:bg-[#2f2f2f] shadow-lg focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-all">
                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 py-2 px-4"
                    placeholder="Ask anything"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={status !== "ready"}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!input.trim() || status !== "ready"}
                    className={`p-2 rounded-xl self-end transition-all cursor-pointer ${
                      input.trim() && status === "ready"
                        ? "bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100"
                        : "bg-zinc-200 dark:bg-zinc-700 cursor-not-allowed"
                    }`}
                    title="Send"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        input.trim() && status === "ready"
                          ? "text-white dark:text-zinc-900"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Input (After messages) */}
        {messages.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#212121]">
            <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-end gap-2 p-2 border border-zinc-300 dark:border-zinc-700 rounded-3xl bg-white dark:bg-[#2f2f2f] shadow-sm focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors">
                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 py-2 px-4"
                    placeholder="Ask anything"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={status !== "ready"}
                  />

                  {/* Submit/Stop Button */}
                  {status === "submitted" || status === "streaming" ? (
                    <button
                      type="button"
                      onClick={stop}
                      className="p-2 rounded-xl bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 self-end cursor-pointer"
                      title="Stop"
                    >
                      <svg className="w-5 h-5 text-white dark:text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="1" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim() || status !== "ready"}
                      className={`p-2 rounded-xl self-end transition-all cursor-pointer ${
                        input.trim() && status === "ready"
                          ? "bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100"
                          : "bg-zinc-200 dark:bg-zinc-700 cursor-not-allowed"
                      }`}
                      title="Send"
                    >
                      <svg
                        className={`w-5 h-5 ${
                          input.trim() && status === "ready"
                            ? "text-white dark:text-zinc-900"
                            : "text-zinc-400 dark:text-zinc-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                  )}
                </div>
              </form>

              {/* Disclaimer */}
              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2 sm:mt-3 px-2">
                AI can make mistakes. Check important info.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
