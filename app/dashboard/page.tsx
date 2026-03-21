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
import { Map, ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedMapId, setExpandedMapId] = useState<string | null>(null);
  const [conceptDataMap, setConceptDataMap] = useState<Record<string, any>>({});
  const [mapLoading, setMapLoading] = useState<string | null>(null);


  // 🔐 Protect dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchVideos();
    }
  }, []);

  // 📥 Fetch user's videos
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
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
      fetchVideos();
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

            {/* Recent Videos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Your Lectures
              </h2>

              {videos.length === 0 ? (
                <p className="text-muted-foreground">
                  No videos submitted yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {videos.map((video) => (
                    <div key={video.id}>
                      <Link href={`/lecture/${video.id}`}>
                        <Card className="p-4 border-border/50 hover:bg-muted/50 cursor-pointer transition">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {video.title || "Untitled Lecture"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {video.video_url}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  video.status === "completed"
                                    ? "bg-green-500/10 text-green-700"
                                    : "bg-yellow-500/10 text-yellow-700"
                                }`}
                              >
                                {video.status}
                              </span>

                              {video.status === "summarized" && (
                                <div className="flex gap-2">
                                  <Link href={`/summary/${video.id}`}>
                                    <Button size="sm" variant="outline">
                                      View Summary
                                    </Button>
                                  </Link>
                                  <Link href={`/concept-map/${video.id}`}>
                                    <Button size="sm" className="bg-accent">
                                      View Map
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => toggleConceptMap(video.id, e)}
                                    className="flex items-center gap-1"
                                  >
                                    <Map className="w-4 h-4" />
                                    {expandedMapId === video.id ? (
                                      <>Hide Map <ChevronUp className="w-3 h-3" /></>
                                    ) : (
                                      <>Show Map <ChevronDown className="w-3 h-3" /></>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>

                      {/* Inline Concept Map */}
                      {expandedMapId === video.id && (
                        <Card className="mt-2 p-4 border-border/50">
                          {mapLoading === video.id ? (
                            <div className="text-center py-8 text-muted-foreground">
                              Loading concept map...
                            </div>
                          ) : conceptDataMap[video.id] ? (
                            <ConceptMap conceptData={conceptDataMap[video.id]} />
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              Concept map not available for this video.
                            </div>
                          )}
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
