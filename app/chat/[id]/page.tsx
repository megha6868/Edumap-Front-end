"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ChatTutor from "@/components/ChatTutor";

interface LectureData {
  id: string;
  title?: string;
  video_url: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lecture, setLecture] = useState<LectureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchLecture = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/video/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLecture(res.data);
      } catch (err) {
        console.error("Failed to load lecture data");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-5xl mx-auto space-y-6">

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>

            {loading ? (
              <p className="text-muted-foreground">Loading chat...</p>
            ) : !lecture ? (
              <p className="text-red-500">Lecture not found.</p>
            ) : (
              <>
                {/* Title */}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {lecture.title || "Lecture Chat Tutor"}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lecture.video_url}
                  </p>
                </div>

                {/* Chat Tutor Content */}
                <div className="h-[calc(100vh-250px)] min-h-[500px]">
                  <ChatTutor videoId={id as string} />
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
