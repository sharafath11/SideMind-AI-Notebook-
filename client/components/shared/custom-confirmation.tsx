"use client"

import React from "react"
import { AlertCircle, CheckCircle, AlertTriangle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ICustomConfirmationProps } from "@/types/propsTypes"


const variantStyles = {
  default: {
    container: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    title: "text-blue-900 dark:text-blue-100",
    description: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
    confirmButton: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600",
  },
  success: {
    container: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    title: "text-green-900 dark:text-green-100",
    description: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
    confirmButton: "bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
    title: "text-amber-900 dark:text-amber-100",
    description: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
    confirmButton: "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600",
  },
  danger: {
    container: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    title: "text-red-900 dark:text-red-100",
    description: "text-red-700 dark:text-red-300",
    icon: "text-red-600 dark:text-red-400",
    confirmButton: "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600",
  },
}

const defaultIcons = {
  default: <AlertCircle className="w-6 h-6" />,
  success: <CheckCircle className="w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  danger: <Trash2 className="w-6 h-6" />,
}

export const CustomConfirmation = React.forwardRef<HTMLDivElement, ICustomConfirmationProps>(
  (
    {
      variant = "default",
      title,
      description,
      icon,
      confirmText = "Confirm",
      cancelText = "Cancel",
      onConfirm,
      onCancel,
      isOpen,
      isLoading = false,
      className,
    },
    ref,
  ) => {
    const [isProcessing, setIsProcessing] = React.useState(false)

    const handleConfirm = async () => {
      setIsProcessing(true)
      try {
        await onConfirm()
      } finally {
        setIsProcessing(false)
      }
    }

    if (!isOpen) return null

    const styles = variantStyles[variant]
    const displayIcon = icon ?? defaultIcons[variant]

    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={onCancel}
          aria-hidden="true"
        />
        <div
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200",
            className,
          )}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
          aria-describedby="confirmation-description"
        >
          <div className={cn("rounded-lg border p-6 shadow-lg", styles.container)}>
            <div className="flex gap-4 mb-4">
              <div className={cn("flex-shrink-0", styles.icon)}>{displayIcon}</div>
              <div className="flex-1">
                <h2 id="confirmation-title" className={cn("text-lg font-semibold", styles.title)}>
                  {title}
                </h2>
              </div>
            </div>
            {description && (
              <p id="confirmation-description" className={cn("text-sm mb-6", styles.description)}>
                {description}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                  styles.confirmButton,
                )}
              >
                {isProcessing ? "Processing..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      </>
    )
  },
)

CustomConfirmation.displayName = "CustomConfirmation"
