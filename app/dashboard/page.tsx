"use client";

import { useMemo, useState, useEffect } from "react";

import { Appbar } from "../components/Appbar";
type Song = {
  id: string;
  title: string;
  url: string;
  videoId: string;
  votes: number;
  submittedBy: string;
};

function extractYouTubeVideoId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";
    return "";
  } catch {
    return "";
  }
}

function thumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
const REFERESH_INTERVAL_MS = 10*1000;

export default function StreamVotePage() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      title: "Lofi Study Mix",
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      videoId: "jfKfPfyJRdk",
      votes: 24,
      submittedBy: "Ava",
    },
    {
      id: "2",
      title: "Dreams in Motion",
      url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
      videoId: "5qap5aO4i9A",
      votes: 18,
      submittedBy: "Noah",
    },
    {
      id: "3",
      title: "Midnight Drive",
      url: "https://www.youtube.com/watch?v=3JZ4pnNtyxQ",
      videoId: "3JZ4pnNtyxQ",
      votes: 12,
      submittedBy: "Mia",
    },
  ]);
  const [currentId, setCurrentId] = useState("1");
  useEffect(()=> {
    refreshStreams();
    const interval = setInterval(()=> {

    }, REFERESH_INTERVAL_MS)
  },[])

  const previewVideoId = extractYouTubeVideoId(url);
  const currentSong = songs.find((s) => s.id === currentId) || songs[0];

  const queue = useMemo(() => {
    return [...songs]
      .filter((s) => s.id !== currentId)
      .sort((a, b) => b.votes - a.votes);
  }, [songs, currentId]);

  function addSong() {
    if (!previewVideoId) return;

    const newSong: Song = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled Song",
      url,
      videoId: previewVideoId,
      votes: 0,
      submittedBy: "You",
    };

    setSongs((prev) => [newSong, ...prev]);
    setCurrentId((prev) => prev ?? newSong.id);
    setTitle("");
    setUrl("");
  }

  function vote(songId: string, delta: number) {
    setSongs((prev) =>
      prev.map((song) =>
        song.id === songId ? { ...song, votes: song.votes + delta } : song
      )
    );
  }

  function playSong(songId: string) {
    setCurrentId(songId);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Appbar />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-6 rounded-[30px] border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-sky-600">
                Creator stream queue
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Vote the next song
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
                Live
              </div>
              <div className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white">
                {songs.length} songs
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
          <section className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Now playing</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Main screen for the active song.
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                Featured
              </span>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100">
              <iframe
                className="aspect-video w-full xl:aspect-[16/9]"
                src={`https://www.youtube.com/embed/${currentSong.videoId}`}
                title={currentSong.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-4 rounded-[26px] bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-500">
                Current track
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {currentSong.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Submitted by {currentSong.submittedBy}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {currentSong.votes} votes
              </p>
            </div>

            <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-700">Add a song</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Song title"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                <button
                  onClick={addSong}
                  disabled={!previewVideoId}
                  className="h-11 rounded-2xl bg-sky-600 px-5 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Add
                </button>
              </div>
            </div>
          </section>

          <aside className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Voting queue</h2>
              <p className="mt-1 text-xs text-slate-500">
                Compact cards for ranking and playback.
              </p>
            </div>

            <div className="space-y-3">
              {queue.map((song, index) => (
                <div
                  key={song.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-3 transition hover:border-sky-200 hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex gap-3">
                    <img
                      src={thumbnail(song.videoId)}
                      alt={song.title}
                      className="h-16 w-24 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {song.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {song.submittedBy}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-sky-50 px-3 py-2 text-center ring-1 ring-sky-100">
                          <div className="text-lg font-semibold text-sky-700">
                            {song.votes}
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-sky-500">
                            score
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Rank #{index + 1}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => vote(song.id, 1)}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                        >
                          Like
                        </button>
                        <button
                          onClick={() => vote(song.id, -1)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                          Dislike
                        </button>
                        <button
                          onClick={() => playSong(song.id)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Play now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {queue.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
                  No songs in the queue yet.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function refreshStreams() {
    // Fetch updated song data from API
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Failed to refresh streams:", err));
}
function setSongs(data: any): any {
    throw new Error("Function not implemented.");
}

