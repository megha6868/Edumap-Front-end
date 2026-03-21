
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Video {
  id: string;
  title: string;
  video_url: string;
  status: "summarized" | "processing" | "failed";
}

export default function HistoryPage() {
  const router = useRouter();

  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"all" | "summarized" | "processing" | "failed">("all");
  const [loading, setLoading] = useState(true);

  /* =========================
     AUTH + FETCH VIDEOS
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchVideos(token);
  }, []);

  const fetchVideos = async (token: string) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/video/my-videos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEARCH + FILTER
     ========================= */
  const filteredVideos = videos.filter((video) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      video.title.toLowerCase().includes(term) ||
      video.video_url.toLowerCase().includes(term);

    const matchesStatus =
      filterStatus === "all" || video.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  /* =========================
     STATUS COLOR
     ========================= */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "summarized":
        return "bg-green-500/10 text-green-700";
      case "processing":
        return "bg-yellow-500/10 text-yellow-700";
      case "failed":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">

            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Video History
              </h1>
              <p className="text-muted-foreground">
                View all processed lecture videos
              </p>
            </div>

            {/* SEARCH + FILTER */}
            <Card className="p-6 border-border/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search by title or URL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(["all", "summarized", "processing", "failed"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={
                          filterStatus === status ? "default" : "outline"
                        }
                        onClick={() => setFilterStatus(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </Card>

            {/* LIST */}
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Loading videos...</p>
              </Card>
            ) : filteredVideos.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No videos found</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="p-4 border-border/50 hover:border-border transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* LEFT */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {video.video_url}
                        </p>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            video.status
                          )}`}
                        >
                          {video.status}
                        </div>

                        {video.status === "summarized" && (
                          <>
                            {/* ✅ SAME AS DASHBOARD */}
                            <Link href={`/lecture/${video.id}`}>
                              <Button size="sm" variant="outline">
                                Summary
                              </Button>
                            </Link>

                            <Link href={`/concept-map/${video.id}`}>
                              <Button size="sm">
                                Concept Map
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}