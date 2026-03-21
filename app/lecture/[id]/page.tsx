"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Card } from "@/components/ui/card";

interface Lecture {
  id: string;
  title?: string;
  video_url: string;
  transcript?: string;
  summary?: string;
  status: string;
}

export default function LecturePage() {
  const { id } = useParams();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const token = localStorage.getItem("token");

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
        console.error("Failed to load lecture");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  if (loading) {
    return <p className="p-8">Loading lecture...</p>;
  }

  if (!lecture) {
    return <p className="p-8 text-red-500">Lecture not found</p>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-5xl mx-auto space-y-6">

            {/* Lecture Title */}
            <h1 className="text-2xl font-bold text-foreground">
              {lecture.title || "Lecture"}
            </h1>

            {/* Video URL */}
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                {lecture.video_url}
              </p>
            </Card>

            {/* Transcription */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-3">Transcription</h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {lecture.transcript || "Transcription not available yet."}
              </p>
            </Card>

            {/* Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-3">Summary</h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {lecture.summary || "Summary not available yet."}
              </p>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
