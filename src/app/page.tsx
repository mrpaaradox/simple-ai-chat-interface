import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-3xl">
      AI Chat App
      <div className="text-2xl py-2 text-blue-500">
        <Link href={`/ui/completion`}>Simple Chat Completion</Link>
      </div>
      <div className="text-2xl py-2 text-emerald-500">
        <Link href={`/ui/stream`}>Stream Chat App</Link>
      </div>
    </div>
  );
}
