"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ConceptMap from "@/components/ConceptMap";
import { Map, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

interface Video {
  id: string;
  title: string;
  video_url: string;
  status: "pending" | "processing" | "completed" | "summarized";
}

export default function DashboardPage() {
  const router = useRouter();

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedMapId, setExpandedMapId] = useState<string | null>(null);
  const [conceptDataMap, setConceptDataMap] = useState<Record<string, any>>({});
  const [mapLoading, setMapLoading] = useState<string | null>(null);

  const recentVideos = videos.slice(0, 5);

  // 🔐 Protect dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchVideos(currentPage);
    }
  }, [currentPage]);

  // 📥 Fetch user's videos
  const fetchVideos = async (page: number = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:5000/api/video/my-videos?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVideos(response.data.videos);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
    } catch (error) {
      console.error("Error fetching videos");
    }
  };

  // ➕ Submit new video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:5000/api/video/submit",
        { video_url: videoUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Video submitted successfully");
      setVideoUrl("");
      setCurrentPage(1); // Go to first page to see the new video
      fetchVideos(1);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error submitting video");
    } finally {
      setLoading(false);
    }
  };

  // 🗺️ Toggle concept map for a video
  const toggleConceptMap = async (videoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (expandedMapId === videoId) {
      setExpandedMapId(null);
      return;
    }

    setExpandedMapId(videoId);

    if (!conceptDataMap[videoId]) {
      setMapLoading(videoId);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/video/${videoId}/concept-map`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConceptDataMap((prev) => ({ ...prev, [videoId]: response.data }));
      } catch (error) {
        console.error("Failed to fetch concept map:", error);
      } finally {
        setMapLoading(null);
      }
    }
  };



  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">

            {/* Add Video Section */}

            <Card className="p-6 border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Add New Lecture
              </h2>

              <form onSubmit={handleAddVideo} className="space-y-4">
                <label className="text-sm font-medium text-foreground">
                  YouTube Video URL
                </label>

                <div className="flex gap-3">
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Processing..." : "Add Lecture"}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Recent Searches */}
            <Card className="p-6 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Recent Searches
                  </h2>
                  
                </div>
                {/* <span className="text-sm text-muted-foreground">
                  {recentVideos.length} / 5
                </span> */}
              </div>

              {recentVideos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent searches yet.
                </p>
              ) : (
                <div className="grid gap-3">
                  {recentVideos.map((video) => (
                    <Link
                      key={video.id}
                      href={video.status === "summarized" ? `/summary/${video.id}` : `/lecture/${video.id}`}
                      className="block rounded-xl border border-border/50 p-4 transition hover:bg-muted"
                    >
                      <h3 className="font-medium text-foreground truncate">
                        {video.title || "Untitled Lecture"}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {video.video_url}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
