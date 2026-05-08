
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Video {
  id: string;
  title: string;
  video_url: string;
  status: "summarized" | "processing" | "failed";
}

export default function HistoryPage() {
  const router = useRouter();

  const [videos, setVideos] = useState<Video[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"all" | "summarized" | "failed">("all");
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

    fetchVideos(token, currentPage);
  }, [currentPage]);

  const fetchVideos = async (token: string, page: number) => {
    setLoading(true);
    try {
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
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEARCH + FILTER
     ========================= */
  const filteredVideos = (videos || []).filter((video) => {
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
    if (status === "summarized" || status === "completed") {
      return "bg-green-500/10 text-green-700";
    }
    if (status === "failed") {
      return "bg-red-500/10 text-red-700";
    }
    return "bg-yellow-500/10 text-yellow-700";
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">

            {/* HEADER */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Video History
              </h1>
              <p className="text-muted-foreground">
                Review and access all your processed lecture materials.
              </p>
            </div>

            {/* SEARCH + FILTER */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                <div className="flex-1">
                  <Input
                    placeholder="Search by title or URL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors w-full"
                  />
                </div>

                <div className="w-full md:w-48">
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="summarized">Summarized</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* LIST */}
            <div className="space-y-4">
              

              {loading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 border-border/50 animate-pulse bg-muted/5"></Card>
                  ))}
                </div>
              ) : filteredVideos.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-border/50 bg-muted/5">
                  <p className="text-muted-foreground font-medium">No records found for this criteria.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {filteredVideos.map((video) => (
                      <Card
                        key={video.id}
                        className="p-5 border-border/50 hover:bg-muted/50 cursor-pointer transition-all duration-200 group relative"
                        onClick={() => {
                          if (video.status === "summarized") {
                            router.push(`/summary/${video.id}`);
                          } else {
                            router.push(`/lecture/${video.id}`);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg truncate">
                              {video.title || "Untitled Lecture"}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate opacity-80 mt-1">
                              {video.video_url}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusColor(
                                video.status
                              )}`}
                            >
                              {video.status}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-6 mt-12 py-6 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="hover:bg-primary/5 rounded-full px-6"
                      >
                        Previous Page
                      </Button>
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-semibold bg-muted/50 px-3 py-1 rounded-md">
                           {currentPage}
                         </span>
                         <span className="text-sm text-muted-foreground">of</span>
                         <span className="text-sm font-bold text-muted-foreground">
                           {totalPages}
                         </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="hover:bg-primary/5 rounded-full px-6"
                      >
                        Next Page
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}