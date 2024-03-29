"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="p-4 dark flex flex-col items-center space-y-4 bg-gray-800 text-white">
        <h1 className="text-3xl font-bold">Join Chat</h1>
        <p className="text-gray-400">
          Enter your chat code below to join the conversation.
        </p>
        <form className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <label className="text-gray-300" htmlFor="chat-code">
              Meeting Url
            </label>
            <input
              className="bg-gray-700 px-4 py-2 ml-2 text-white placeholder-gray-500"
              id="chat-code"
              placeholder="Enter chat code..."
            />
          </div>
          <div className="flex space-x-4">
            <Link href="/meeting">
              <button className="bg-blue-600 px-4 py-2 rounded-sm text-white hover:bg-blue-700">
                Join Meeting
              </button>
            </Link>
            <Link href="/meeting/123">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700"
                type="button"
              >
                New Meeting
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
