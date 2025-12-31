"use client";

import { useCompletion } from "@ai-sdk/react";
import Link from "next/link";
import { useState } from "react";

export default function StreamPage() {
  const [prompt, setPrompt] = useState("");
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop,
  } = useCompletion({
    api: "/api/stream",
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <Link href={`/`}>
        <p className="text-2xl sm: pl-4 md:pl-0 hover:cursor-pointer">Back</p>
      </Link>
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {isLoading && !completion && (
        <div className="sm: pl-4 md:pl-0">Loading....</div>
      )}
      {completion && (
        <div className="whitespace-pre-wrap sm:pl-0 md: pl-4">{completion}</div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setInput("");
          handleSubmit(e);
        }}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg  "
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            placeholder="Ask me anything..."
            value={input}
            onChange={handleInputChange}
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
