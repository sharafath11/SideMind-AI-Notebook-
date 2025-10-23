"use client";

import { useState, useEffect } from "react";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { IPageHeaderProps } from "@/types/propsTypes";
import { ThemeToggle } from "./ThemeToggle";
import { authService } from "@/services/auth.service";
import { showInfoToast } from "./toast";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomConfirmation } from "./custom-confirmation";
import axios from "axios";

export function PageHeader({ userDet }: IPageHeaderProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);
  useEffect(() => {
  const fetchQuote = async () => {
    try {
      const res = await axios.get("/api/quote");
      const data = res.data;
      console.log("ranodm",data)
      if (Array.isArray(data) && data[0]?.q && data[0]?.a) {
        setQuote({
          q: data[0].q,
          a: data[0].a,
        });
      } else {
        setQuote({
          q: "The mind is not a vessel to be filled, but a fire to be kindled.",
          a: "Plutarch",
        });
      }
    } catch (err) {
      setQuote({
        q: "The mind is not a vessel to be filled, but a fire to be kindled.",
        a: "Plutarch",
      });
    }
  };

  fetchQuote();
}, [userDet]);

  const handleLogout = async () => {
    const res = await authService.logout();
    if (!res.ok) return showInfoToast(res.msg);
    dispatch(clearUser());
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">AI Notes</h1>
        </div>

        <div className="flex items-center gap-4">
          {userDet && (userDet.name || userDet.email) && (
            <div className="flex flex-col items-end justify-center">
              <p className="text-sm font-extrabold text-foreground">
                {userDet.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">{userDet.email}</p>
            </div>
          )}
          <ThemeToggle />
          {userDet && (
            <Button
              onClick={() => setIsConfirmOpen(true)}
              variant="outline"
              className="border-border hover:bg-muted bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>

    
        <div className="text-center mb-10 p-4 rounded-lg bg-primary/10 border border-primary/20 transition-all">
          {quote ? (
            <p className="text-sm italic text-foreground/80">
              “{quote.q}” — {quote.a}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Fetching your daily motivation…
            </p>
          )}
        </div>
  
      <CustomConfirmation
        variant="danger"
        title="Are you sure you want to logout?"
        description="You’ll be signed out from your account and redirected to the login page."
        confirmText="Logout"
        cancelText="Cancel"
        isOpen={isConfirmOpen}
        onConfirm={async () => {
          await handleLogout();
          setIsConfirmOpen(false);
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
