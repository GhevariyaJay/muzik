import {
  BadgeCheck,
  ChevronRight,
  Music2,
  PlayCircle,
  Radio,
  Sparkles,
  Users,
  Waves,
  Heart,
} from "lucide-react";

import { Appbar } from "../app/components/Appbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Redirect } from "./components/Redirect";

export default function HomePage() {
  const features = [
    {
      icon: <Music2 className="h-5 w-5" />,
      title: "Fan-powered queue",
      description:
        "Let your audience vote on what plays next while you keep full control of the stream.",
    },
    {
      icon: <Radio className="h-5 w-5" />,
      title: "Live room energy",
      description:
        "Create an immersive listening room with real-time reactions, requests, and instant updates.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Creator moderation",
      description:
        "Approve or reject requests, filter the queue, and keep the vibe aligned with your stream.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Premium visuals",
      description:
        "A cinematic UI with glowing gradients, responsive cards, and a polished creator-first layout.",
    },
  ];

  const steps = [
    {
      title: "Start your stream",
      description: "Creators go live and open a music room for their audience.",
    },
    {
      title: "Fans vote or request",
      description: "Viewers suggest tracks and vote on what should play next.",
    },
    {
      title: "Queue updates instantly",
      description: "The live playlist refreshes in real time for everyone in the room.",
    },
    {
      title: "Keep the show moving",
      description: "You stay in control while fans shape the soundtrack.",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Appbar />
      <Redirect />
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.24),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="max-w-2xl">
              <Badge className="mb-6 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-white hover:bg-white/15">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Creator-led streams, fan-selected tracks
              </Badge>

              <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Let your fans choose the music that plays on your stream.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                Build a live music experience where creators keep control and fans shape the queue with votes, requests, and reactions in real time.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-7 text-zinc-950 hover:bg-white/90"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Streaming
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
                >
                  Watch Demo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/55">
                <div>
                  <p className="text-2xl font-semibold text-white">12k+</p>
                  <p>active creators</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">4.9/5</p>
                  <p>community rating</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">Live</p>
                  <p>fan voting</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-3xl" />
              <div className="absolute -right-6 bottom-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

              <Card className="relative overflow-hidden border-white/10 bg-white/5 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
                <CardHeader className="border-b border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Live Creator Room</CardTitle>
                      <CardDescription className="text-white/55">
                        Nova is live right now
                      </CardDescription>
                    </div>
                    <Badge className="rounded-full bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">
                      <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                      2.4k viewers
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/50">Now playing</p>
                        <p className="text-lg font-semibold">Midnight City</p>
                      </div>
                      <Heart className="h-5 w-5 text-pink-400" />
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {["Ava", "Noah", "Mia"].map((name) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="text-sm text-white/80">@{name}</span>
                        <span className="text-sm text-white/45">upvoted</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10" />

                  <Tabs defaultValue="queue" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5">
                      <TabsTrigger value="queue">Queue</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="queue" className="mt-4">
                      <p className="text-sm text-white/60">
                        Top voted tracks are automatically sorted to the top.
                      </p>
                    </TabsContent>
                    <TabsContent value="activity" className="mt-4">
                      <p className="text-sm text-white/60">
                        Real-time requests and reactions appear here.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-cyan-300">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for creators who want a beautiful live music experience.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-white/60">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-fuchsia-300">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            A simple flow from request to playback.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-950 font-semibold">
                  {index + 1}
                </div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription className="text-white/60">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="cta" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Card className="border-white/10 bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 text-white">
          <CardContent className="flex flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-medium text-white/70">Get started</p>
              <h3 className="mt-2 text-3xl font-semibold">
                Ready to launch your live music queue?
              </h3>
              <p className="mt-2 max-w-2xl text-white/70">
                Connect your stream, open the request room, and let your audience vote the next song into play.
              </p>
            </div>
            <Button size="lg" className="rounded-full bg-white px-8 text-zinc-950 hover:bg-white/90">
              Start Streaming
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}