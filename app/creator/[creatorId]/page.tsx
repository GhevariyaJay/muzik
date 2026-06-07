"use client";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Appbar } from "../../components/Appbar";

type Song = {
  id: string;
  title: string;
  url: string;
  videoId: string;
  votes: number;
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

const REFRESH_INTERVAL_MS = 2000;

export default function CreatorPage({ params }: { params: { creatorId: string } }) {
  const creatorId = params.creatorId;
  const [songs, setSongs] = useState<Song[]>([]);

  const refreshStreams = async () => {
    try {
      const res = await axios.get(`/api/streams?creatorId=${creatorId}`);
      const streams = res.data.streams.map((s: any) => ({
        id: s.id,
        title: "Youtube Video",
        url: s.url,
        videoId: s.extractedId,
        votes: s.votes,
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
  }, [creatorId]);

  const currentSong = songs[0];

  const queue = useMemo(() => {
    return songs.slice(1);
  }, [songs]);

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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Appbar />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-6 rounded-[30px] border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <h1 className="text-3xl font-semibold tracking-tight">Viewing Stream: {creatorId}</h1>
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
          <section className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            {currentSong ? (
              <>
                <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100 aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1&mute=1`}
                    title={currentSong.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="mt-4 rounded-[26px] bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-5 ring-1 ring-slate-200">
                   <h3 className="text-xl font-semibold">{currentSong.title}</h3>
                   <p className="text-sm text-slate-500">{currentSong.votes} votes</p>
                </div>
              </>
            ) : (
              <div className="rounded-[30px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-400">
                Wait for the creator to add songs!
              </div>
            )}
          </section>

          <aside className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold mb-4">Voting queue</h2>
            <div className="space-y-3">
              {queue.map((song) => (
                <div key={song.id} className="flex gap-3 p-3 border border-slate-100 rounded-2xl hover:border-sky-100 transition">
                  <img src={thumbnail(song.videoId)} className="h-16 w-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm truncate">{song.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                       <div className="flex gap-2">
                        <button onClick={() => vote(song.id, true)} className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-medium hover:bg-sky-100 transition">Like</button>
                        <button onClick={() => vote(song.id, false)} className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-medium hover:bg-rose-100 transition">Dislike</button>
                       </div>
                       <span className="text-sm font-bold text-slate-700">{song.votes}</span>
                    </div>
                  </div>
                </div>
              ))}
              {queue.length === 0 && (
                <p className="text-center text-sm text-slate-400 py-4">Lower votes mean shorter wait!</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
