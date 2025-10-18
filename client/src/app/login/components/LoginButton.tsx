"use client"
import { Button } from "@/components/ui/button"
import React from "react"

interface LoginButtonProps {
  isLoading: boolean
}

const LoginButton: React.FC<LoginButtonProps> = ({ isLoading }) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Logging in ...
        </div>
      ) : (
        "Log in"
      )}
    </Button>
  )
}

export default LoginButton
