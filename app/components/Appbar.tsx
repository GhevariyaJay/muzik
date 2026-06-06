"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Appbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !isLoggedIn) {
      router.replace("/");
    }
  }, [status, isLoggedIn, router]);

  if (status === "loading") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">SongVote</p>
            <p className="text-xs text-white/50">Creator stream queue</p>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="hidden text-sm text-white/70 sm:block">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}