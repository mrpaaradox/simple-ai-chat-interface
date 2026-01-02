"use client";

import Link from "next/link";
import { MessageSquare, Table, ArrowRight, Github } from "lucide-react";


export default function Home() {
  const routes = [
    {
      title: "Chat Interface",
      description: "Full-featured AI chat experience with message history and regeneration.",
      href: "/ui/chat",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Structured Data",
      description: "Extract and generate structured data based on specific schemas.",
      href: "/ui/structured-data",
      icon: <Table className="w-6 h-6" />,
      color: "bg-green-500/10 text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground font-sans">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-lg">AI</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Chat Evolution</span>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium">

              <a 
                href="https://github.com/mrpaaradox/ai-chatty" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-muted-foreground transition-colors cursor-pointer"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            AI Conversation Evolved
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Explore diverse AI interface patterns. From simple completions to complex structured data extraction, 
            experience the future of human-AI interaction.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {routes.map((route) => (
            <Link 
              key={route.href} 
              href={route.href}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-2xl hover:shadow-foreground/5 overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${route.color} transition-transform group-hover:scale-110 duration-300`}>
                  {route.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {route.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {route.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </div>
              </div>
              
              {/* Subtle accent background */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Features / Footer Info */}
        <div className="mt-32 border-t border-border pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="text-lg font-bold mb-4">Responsive Design</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Optimized for all devices. Experience smooth transitions and perfect layouts whether you&apos;re on mobile, tablet, or desktop.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Minimal Aesthetic</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Clean, distraction-free interfaces inspired by ShadCN and modern design principles to keep the focus on conversation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Advanced Tech</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Built with Next.js, AI SDK, and Tailwind CSS v4 for ultimate performance and a Developer Experience that feels like magic.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Chat Evolution. Built with passion.
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/ui/chat" className="hover:text-foreground transition-colors">Chat</Link>
            <Link href="/ui/stream" className="hover:text-foreground transition-colors">Stream</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
