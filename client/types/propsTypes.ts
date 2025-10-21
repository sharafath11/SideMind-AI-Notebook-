import { IUser } from "./userTypes";

export interface IPageHeaderProps {
  userDet: IUser | null;
}
export  interface CustomAlertProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  closeable?: boolean;
  className?: string;
  children?: React.ReactNode;
  toastId: string;
}
export interface ICustomConfirmationProps {
  variant?: "default" | "success" | "warning" | "danger"
  title: string
  description?: string
  icon?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isOpen: boolean
  isLoading?: boolean
  className?: string
}
