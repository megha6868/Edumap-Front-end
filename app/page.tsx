"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>
          <span className="font-semibold text-xl text-foreground">EduMap</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Transform Lectures into
            <span className="text-primary"> Smart Learning</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            EduMap automatically generates summaries and interactive concept maps from your lecture videos. Learn
            smarter, understand better, remember longer.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
            <Card className="p-6 border-border/50 text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="font-semibold mb-2">Auto Transcription</h3>
              <p className="text-sm text-muted-foreground">AI-powered speech-to-text conversion with high accuracy</p>
            </Card>

            <Card className="p-6 border-border/50 text-left">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2">Smart Summaries</h3>
              <p className="text-sm text-muted-foreground">Key points extracted and organized by topic</p>
            </Card>

            <Card className="p-6 border-border/50 text-left">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🧠</span>
              </div>
              <h3 className="font-semibold mb-2">Concept Maps</h3>
              <p className="text-sm text-muted-foreground">Visual relationships between ideas and concepts</p>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Learning Free
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-12 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Trusted by students and educators</p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="font-semibold text-2xl text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Videos Processed</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-2xl text-primary">95%</p>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-2xl text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
