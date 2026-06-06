"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-white/60">
            Use your email and password to continue.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-white/75">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-white outline-none placeholder:text-white/35 focus:border-white/20"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-white/75">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-white outline-none placeholder:text-white/35 focus:border-white/20"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-white px-4 font-medium text-zinc-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <Link
            href="/signup"
            className="block h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center font-medium text-white transition hover:bg-white/10"
          >
            Create account
          </Link>
        </form>
      </div>
    </div>
  );
}