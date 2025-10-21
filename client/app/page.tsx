"use client";

import { useState,  } from "react";
import { signIn,  } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import googleSvg from "../public/google.svg";
import { showErrorToast } from "@/components/shared/toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/home" });
      } catch (error) {
      console.error("Google sign-in failed:", error);
      showErrorToast("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-lg overflow-hidden transition-all duration-300">
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Sign in securely using your Google account.
          </p>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-base transition-all duration-200 group relative flex items-center justify-center shadow-sm hover:shadow-md"
          >
            {!isLoading && (
              <img
                src={googleSvg.src || googleSvg}
                alt="Google Logo"
                className="w-5 h-5 mr-3"
                aria-hidden="true"
              />
            )}
            {isLoading ? "Signing In..." : "Sign in with Google"}
          </Button>

          <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
            By signing in, you agree to our Terms of Service.
          </p>
        </div>
      </Card>
    </div>
  );
}
