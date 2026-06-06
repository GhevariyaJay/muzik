"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data: { error?: string } = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create account");
      return;
    }

    window.location.href = "/signin";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">Sign up</h1>
        <p className="mt-2 text-sm text-white/60">Create your account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-white outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-white outline-none"
          />

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-white px-4 font-medium text-zinc-950 disabled:opacity-70"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <Link
            href="/signin"
            className="block h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center font-medium text-white"
          >
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}