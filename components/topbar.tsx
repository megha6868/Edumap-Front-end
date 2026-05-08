"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, ChevronDown } from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

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
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!username) return null;

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-border bg-card px-6 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">EduMap</h1>

        <div className="flex items-center h-full">
          <DropdownMenu modal={false}>
            {/* 1. The Trigger Container: Matches Header Height */}
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer h-[calc(100%-8px)] px-3 rounded-xl transition-all relative z-30 data-[state=open]:bg-muted/50 hover:bg-muted/50 data-[state=open]:rounded-b-none group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors overflow-hidden border border-primary/20">
                   <span className="text-sm font-semibold text-primary">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm leading-tight hidden sm:block">
                  <p className="font-semibold text-foreground">{username}</p>
                  <p className="text-xs text-muted-foreground font-medium">Student</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
              </div>
            </DropdownMenuTrigger>
            
            {/* 2. The Dropdown: Pixel-perfect extension */}
            <DropdownMenuContent 
              align="end" 
              sideOffset={0} 
              className="
                w-[var(--radix-dropdown-menu-trigger-width)] 
                min-w-[var(--radix-dropdown-menu-trigger-width)]
                bg-card border-border border-t-0 rounded-t-none rounded-b-2xl 
                p-1.5 shadow-2xl animate-in slide-in-from-top-1 duration-200
              "
            >
              <DropdownMenuItem 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg transition-colors group cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsLogoutDialogOpen(true);
                }}
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span className="font-bold">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log you out of your account. You will need to login again to access your lectures.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-white hover:bg-destructive/90">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}