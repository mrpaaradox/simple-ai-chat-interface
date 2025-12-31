"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount and scroll to it
  useEffect(() => {
    inputRef.current?.focus();
    // Quick scroll to input on page load
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ 
        behavior: "auto", 
        block: "center" 
      });
    }, 100);
  }, []);

  // Handle input focus - scroll input into view quickly
  const handleInputFocus = () => {
    // Small delay to allow keyboard to appear first
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ 
        behavior: "auto", 
        block: "center" 
      });
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-[#212121]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-[#212121] border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[140px] sm:max-w-none">
            <span className="hidden sm:inline">GPT - Generative Pretrained Transformer</span>
            <span className="sm:hidden">ChatGPT</span>
          </h1>
          <div className="w-12 sm:w-16"></div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto w-full px-3 sm:px-6 mt-3 sm:mt-4">
          <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-start pt-8 sm:pt-12 text-center px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-full bg-[#19c37d] flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900 dark:text-zinc-100 px-4">
              How can I help you today?
            </h2>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`group ${
              message.role === "assistant"
                ? "bg-zinc-50 dark:bg-[#2f2f2f]"
                : "bg-white dark:bg-[#212121]"
            } border-b border-zinc-100 dark:border-zinc-800/50`}
          >
            <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 flex gap-3 sm:gap-4 md:gap-6">
              {/* Avatar */}
              <div className="shrink-0 flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    message.role === "assistant"
                      ? "bg-[#19c37d]"
                      : "bg-zinc-700 dark:bg-zinc-600"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-hidden min-w-0">
                <div className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 text-zinc-900 dark:text-zinc-100">
                  {message.role === "assistant" ? "ChatGPT" : "You"}
                </div>
                <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={`${message.id}-${index}`}
                            className="text-sm sm:text-[15px] leading-6 sm:leading-7 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap wrap-break-word"
                          >
                            {part.text}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {(status === "submitted" || status === "streaming") && (
          <div className="bg-zinc-50 dark:bg-[#2f2f2f] border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 flex gap-3 sm:gap-4 md:gap-6">
              <div className="shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#19c37d] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 text-zinc-900 dark:text-zinc-100">
                  ChatGPT
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-zinc-200 dark:border-zinc-800/50 bg-linear-to-b from-white to-zinc-50/50 dark:from-[#212121] dark:to-[#212121]">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-4 md:py-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center group">
              <input
                ref={inputRef}
                className="w-full pl-4 sm:pl-5 pr-12 sm:pr-14 py-3 sm:py-3.5 md:py-4 bg-white dark:bg-[#2f2f2f] border-2 border-zinc-200 dark:border-zinc-700 rounded-[26px] text-sm sm:text-[15px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 shadow-[0_0_0_0_rgba(0,0,0,0)] focus:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:focus:shadow-[0_2px_8px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Message GPT"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={handleInputFocus}
                disabled={status !== "ready"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (form) {
                      handleSubmit(
                        new Event("submit", {
                          bubbles: true,
                          cancelable: true,
                        }) as unknown as React.FormEvent<HTMLFormElement>
                      );
                    }
                  }
                }}
              />
              {status === "submitted" || status === "streaming" ? (
                <button
                  type="button"
                  onClick={stop}
                  className="absolute right-2 sm:right-2.5 p-1.5 sm:p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 active:scale-95 transition-all duration-150"
                  aria-label="Stop generating"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 dark:text-zinc-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className={`absolute right-2 sm:right-2.5 p-1.5 sm:p-2 rounded-full transition-all duration-150 ${
                    input.trim() && status === "ready"
                      ? "bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 shadow-sm"
                      : "bg-zinc-200 dark:bg-zinc-700 cursor-not-allowed"
                  }`}
                  disabled={status !== "ready" || !input.trim()}
                  aria-label="Send message"
                >
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                      input.trim() && status === "ready"
                        ? "text-white dark:text-zinc-900"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              )}
            </div>
          </form>
          <p className="text-[10px] sm:text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2 sm:mt-3 px-2">
            GPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
