"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConceptMap from "@/components/ConceptMap";
import { ArrowLeft, Map, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface LectureData {
  id: string;
  title?: string;
  video_url: string;
  summary?: string;
}

export default function SummaryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lecture, setLecture] = useState<LectureData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Concept Map states
  const [showMap, setShowMap] = useState(false);
  const [conceptData, setConceptData] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState(false);

  // Toggle concept map
  const toggleConceptMap = async () => {
    if (showMap) {
      setShowMap(false);
      return;
    }

    setShowMap(true);

    if (!conceptData) {
      setMapLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/video/${id}/concept-map`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConceptData(response.data);
      } catch (error) {
        console.error("Failed to fetch concept map:", error);
      } finally {
        setMapLoading(false);
      }
    }
  };

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
        console.error("Failed to load lecture summary");
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
              <p className="text-muted-foreground">Loading summary...</p>
            ) : !lecture ? (
              <p className="text-red-500">Lecture not found.</p>
            ) : (
              <>
                {/* Header Title & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-2xl font-bold text-foreground">
                    {lecture.title || "Lecture Summary"}
                  </h1>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/chat/${id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 text-blue-600 border-blue-200">
                        <MessageSquare className="w-4 h-4" />
                        Ask AI Tutor
                      </Button>
                    </Link>
                    
                    <Link href={`/concept-map/${id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Map className="w-4 h-4" />
                        View Map
                      </Button>
                    </Link>

                    
                  </div>
                </div>

                {/* Video URL */}
                <Card className="p-4 border-border/50">
                  <p className="text-sm text-muted-foreground">
                    {lecture.video_url}
                  </p>
                </Card>

                {/* Inline Concept Map */}
                {showMap && (
                  <Card className="p-4 border-border/50 min-h-[400px]">
                    {mapLoading ? (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        Loading concept map...
                      </div>
                    ) : conceptData ? (
                      <ConceptMap conceptData={conceptData} />
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        Concept map not available for this video.
                      </div>
                    )}
                  </Card>
                )}

                {/* Summary */}
                <Card className="p-6 border-border/50">
                  <h2 className="text-lg font-semibold mb-3 text-foreground">
                    Summary
                  </h2>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {lecture.summary ? lecture.summary.split('\n').map((line, i) => {
                      const trimmed = line.trim();
                      
                      // Handle markdown headings (## or ###)
                      const isMdHeading = trimmed.startsWith('##');
                      // Handle wrapped bold headings (**text**)
                      const isWrappedBold = (trimmed.startsWith('**')|| trimmed.startsWith('* **')) && trimmed.endsWith('**');
                      
                      if (isMdHeading || isWrappedBold) {
                        let cleanText = trimmed;
                        if (isMdHeading) {
                          cleanText = trimmed.replace(/^#+\s*/, '');
                        } else if (isWrappedBold) {
                          cleanText = trimmed.slice(2, -2);
                        }

                        return (
                          <p key={i} className="font-bold text-foreground mt-6 mb-2 first:mt-0">
                            {cleanText}
                          </p>
                        );
                      }
                      
                      return <p key={i} className="leading-relaxed">{line}</p>;
                    }) : "Summary not available yet."}
                  </div>
                </Card>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
