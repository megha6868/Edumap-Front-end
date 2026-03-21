"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            {/* Profile Settings */}
            <Card className="p-6 border-border/50 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Profile Settings</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <Input defaultValue="John" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <Input defaultValue="Doe" className="mt-2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input defaultValue="john@example.com" type="email" className="mt-2" />
                </div>
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </div>
            </Card>

            {/* Privacy & Notifications */}
            <Card className="p-6 border-border/50 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-foreground">Email notifications for processed videos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-foreground">Weekly summary digest</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-foreground">Marketing emails</span>
                </label>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border-border/50 space-y-4 border-destructive/20 bg-destructive/5">
              <h2 className="text-xl font-semibold text-foreground">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
              <Button variant="destructive">Delete Account</Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
