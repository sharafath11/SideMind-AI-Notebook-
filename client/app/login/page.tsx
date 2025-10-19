"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { showErrorToast, showSuccessToast } from "@/utils/toast"
import { authService } from "@/services/authService"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with real Google OAuth
      const googleUserData = { email: "user@gmail.com" }
      showSuccessToast(`Logged in as ${googleUserData.email}`)
      // Redirect to dashboard/home
      router.push("/")
    } catch (err) {
      showErrorToast("Google login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <Card className="w-full max-w-md bg-card border-border shadow-lg">
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in with Google</h1>
          <p className="text-muted-foreground text-sm mb-6">Use your Google account to continue</p>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full border-border hover:bg-muted bg-transparent"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
