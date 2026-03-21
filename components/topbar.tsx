/*"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="border-b border-border bg-card p-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">EduMap</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">JD</span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  )
}
*/
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
    } catch (error) {
      console.error("Invalid user data");
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!username) return null; // prevents hydration warning

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">EduMap</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-sm leading-tight">
            <p className="font-medium text-foreground">{username}</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}