import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero section */}
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          AI Chat Application
        </h1>
      </div>

      {/* Version cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">
        {/* V1 - Completion */}
        <Link href="/ui/completion" className="group">
          <div className="h-full p-6 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Completion</h3>
                  <span className="text-xs text-muted-foreground">v1</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* V2 - Stream */}
        <Link href="/ui/stream" className="group">
          <div className="h-full p-6 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Stream</h3>
                  <span className="text-xs text-muted-foreground">v2</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* V3 - Chat */}
        <Link href="/ui/chat" className="group">
          <div className="h-full p-6 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Chat</h3>
                  <span className="text-xs text-muted-foreground">v3</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Built with Next.js
        </p>
      </div>
    </div>
  );
}
