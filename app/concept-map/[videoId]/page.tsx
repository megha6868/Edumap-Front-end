"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import ConceptMap from "@/components/ConceptMap";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Card } from "@/components/ui/card";

export default function ConceptMapPage() {

  const params = useParams();
  const videoId = params.videoId as string;

  const [conceptData, setConceptData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConceptMap();
  }, []);

  const fetchConceptMap = async () => {
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

      setConceptData(response.data);

    } catch (error) {
      console.error("Failed to fetch concept map:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <TopBar />

        <main className="flex-1 overflow-auto">

          <div className="p-8 max-w-7xl mx-auto space-y-6">

            <div>
              <h1 className="text-3xl font-bold">Concept Map</h1>
              <p className="text-muted-foreground">
                Visual representation of lecture concepts
              </p>
            </div>

            {loading ? (
              <Card className="p-8 text-center">
                Loading concept map...
              </Card>
            ) : !conceptData ? (
              <Card className="p-8 text-center">
                Concept map not available
              </Card>
            ) : (
              <Card className="p-4 border-border/50">

                {/* HERE THE VISUALIZATION HAPPENS */}
                <ConceptMap conceptData={conceptData} />

              </Card>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}