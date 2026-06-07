"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Appbar } from "../components/Appbar";

type Song = {
  id: string;
  title: string;
  url: string;
  videoId: string;
  votes: number;
  submittedBy: string;
};

// YouTube Player API Types
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

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
const REFRESH_INTERVAL_MS = 2000; // 2 seconds for "real-time" feel

export default function StreamVotePage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const videoPlayerRef = useRef<any>(null);

  const refreshStreams = async () => {
    try {
      const creatorId = (session?.user as any)?.id;
      if (!creatorId) return;

      const res = await axios.get(`/api/streams?creatorId=${creatorId}`);
      const streams = res.data.streams.map((s: any) => ({
        id: s.id,
        title: "Youtube Video",
        url: s.url,
        videoId: s.extractedId,
        votes: s.votes,
        submittedBy: "User",
      }));
      setSongs(streams);
    } catch (e) {
      console.error("Error refreshing streams", e);
    }
  };

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [session]);

  const currentSong = songs[0]; // Always play the top voted song

  const queue = useMemo(() => {
    return songs.slice(1); // Rest of the items are the queue
  }, [songs]);

  // Handle Automatic Playback
  useEffect(() => {
    if (!currentSong || videoPlayerRef.current) return;

    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    // Ensure we don't add multiple script tags
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (videoPlayerRef.current) return;
      videoPlayerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          origin: window.location.origin,
          host: 'https://www.youtube.com'
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleVideoEnd();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [currentSong]);

  // Sync player with currentSong if it changes
  useEffect(() => {
    if (videoPlayerRef.current && currentSong) {
      const currentVideoId = videoPlayerRef.current.getVideoData?.()?.video_id;
      if (currentVideoId !== currentSong.videoId) {
        videoPlayerRef.current.loadVideoById(currentSong.videoId);
      }
    }
  }, [currentSong]);

  const handleVideoEnd = async () => {
    try {
      // Mark current song as played
      if (currentSong) {
        await axios.post("/api/streams/next"); // Endpoint marks top as played
        refreshStreams();
      }
    } catch (e) {
      console.error("Error advancing to next song", e);
    }
  };

  async function addSong() {
    if (!previewVideoId || !session?.user) return;

    try {
      await axios.post("/api/streams", {
        creatorId: (session.user as any).id,
        url: url,
      });
      setTitle("");
      setUrl("");
      refreshStreams();
    } catch (e) {
      console.error("Error adding song", e);
    }
  }

  async function vote(streamId: string, isUpvote: boolean) {
    try {
      await axios.post(`/api/streams/${isUpvote ? "upvotes" : "downvotes"}`, {
        streamId,
      });
      refreshStreams();
    } catch (e) {
      console.error("Error voting", e);
    }
  }

  const previewVideoId = extractYouTubeVideoId(url);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-semibold">Please sign in to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Appbar />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-6 rounded-[30px] border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-sky-600">
                Creator live stream
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Now streaming
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
                Live
              </div>
              <div className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white">
                {songs.length} songs in queue
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
          <section className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live player</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Syncing across all users based on votes.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100 aspect-video">
              <div id="youtube-player" className="w-full h-full" />
            </div>

            {currentSong && (
              <div className="mt-4 rounded-[26px] bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-5 ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.28em] text-sky-500">
                  Current track
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  {currentSong.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {currentSong.votes} votes
                </p>
              </div>
            )}

            <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-700">Add to queue</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Song title (optional)"
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
                The most liked songs move to the top!
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
                        </div>
                        <div className="rounded-2xl bg-sky-50 px-3 py-2 text-center ring-1 ring-sky-100">
                          <div className="text-lg font-semibold text-sky-700">
                            {song.votes}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => vote(song.id, true)}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                        >
                          Like
                        </button>
                        <button
                          onClick={() => vote(song.id, false)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                          Dislike
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {queue.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
                  No more songs in the queue.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


