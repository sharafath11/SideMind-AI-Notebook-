"use client";

import { useEffect, useState } from "react";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { showInfoToast } from "./toast";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomConfirmation } from "./custom-confirmation";
import { RootState } from "@/store";
import { authService } from "@/services/auth.service";
import axios from "axios";
import { IUser } from "@/types/userTypes";
import { Session } from "next-auth";
import { clearSubjects } from "@/store/subjectSlice";

export function PageHeader() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session: Session | null = await getSession();

        if (!session?.user) {
          showInfoToast("Please login first.");
          router.push("/");
          return;
        }

        if (user?.userId === session.user.id) return;
        const res = await authService.fetchToken(
          session.user.id,
          session.user.email ?? "",
          session.user.name ?? ""
        );

        if (!res.ok) {
          showInfoToast(res.msg || "Session expired. Please login again.");
          router.push("/");
          return;
        }
        const userData: IUser = {
          name: res.data.name,
          email: res.data.email,
          userId: res.data.userId,
        };
        dispatch(setUser(userData));
      } catch (error) {
        console.error("Error fetching user:", error);
        showInfoToast("Error fetching user. Please login again.");
        router.push("/");
      }
    };

    initAuth();
  }, [dispatch, router, user?.userId]);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get("/api/quote");
        const data = res.data;

        if (Array.isArray(data) && data[0]?.q && data[0]?.a) {
          setQuote({ q: data[0].q, a: data[0].a });
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
  }, []);

  const handleLogout = async () => {
    try {
      const res = await authService.logout();
      if (!res.ok) return showInfoToast(res.msg);
      dispatch(clearUser());
      dispatch(clearSubjects())
      await signOut({ redirect: false });
      router.push("/");
    } catch (err) {
      showInfoToast("Error logging out. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">AI Notes</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex flex-col items-end justify-center">
              <p className="text-sm font-extrabold text-foreground">
                {user.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}

          <ThemeToggle />

          {user && (
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

      {/* Motivational Quote */}
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

      {/* Logout Confirmation */}
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
