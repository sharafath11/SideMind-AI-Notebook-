import { cn } from "@/lib/utils";
import { CustomAlertProps } from "@/types/propsTypes";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { forwardRef } from "react";
import toast from "react-hot-toast";

const variantStyles = {
  default: {
    container: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    title: "text-blue-900 dark:text-blue-100",
    description: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
    closeButton: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-100",
  },
  success: {
    container: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    title: "text-green-900 dark:text-green-100",
    description: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
    closeButton: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-100",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
    title: "text-amber-900 dark:text-amber-100",
    description: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
    closeButton: "text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-100",
  },
  error: {
    container: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    title: "text-red-900 dark:text-red-100",
    description: "text-red-700 dark:text-red-300",
    icon: "text-red-600 dark:text-red-400",
    closeButton: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100",
  },
  info: {
    container: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-800",
    title: "text-cyan-900 dark:text-cyan-100",
    description: "text-cyan-700 dark:text-cyan-300",
    icon: "text-cyan-600 dark:text-cyan-400",
    closeButton: "text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-100",
  },
};

const defaultIcons: Record<NonNullable<CustomAlertProps['variant']>, React.ReactNode> = {
  default: <AlertCircle className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};


export const CustomAlert = forwardRef<HTMLDivElement, CustomAlertProps>(
  ({ variant = "default", title, description, icon, onClose, closeable = true, className, children, toastId }, ref) => {
    
    const handleClose = () => {
      toast.dismiss(toastId);
      onClose?.();
    };

    const styles = variantStyles[variant];
    const displayIcon = icon ?? defaultIcons[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-4 rounded-xl border p-4 shadow-lg w-full max-w-sm",
          styles.container,
          className,
        )}
        role="alert"
      >
        <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>{displayIcon}</div>

        <div className="flex-1 min-w-0">
          {title && <h3 className={cn("font-semibold text-sm", styles.title)}>{title}</h3>}
          {description && <p className={cn("text-sm mt-1", styles.description)}>{description}</p>}
          {children && <div className={cn("text-sm mt-2", styles.description)}>{children}</div>}
        </div>

        {closeable && (
          <button
            onClick={handleClose}
            className={cn("flex-shrink-0 inline-flex rounded-full p-1.5 transition-colors focus:outline-none", styles.closeButton)}
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  },
);

CustomAlert.displayName = "CustomAlert";