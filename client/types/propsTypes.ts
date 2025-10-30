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

export interface SortOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SearchSortPaginateBarProps<T extends string = string> {
  searchQuery: string;
  sortBy: T;
  sortOptions: SortOption<T>[];
  currentPage: number;
  totalPages: number;
  onSearchChange: (query: string) => void;
  onSortChange: (value: T) => void;
  onPageChange: (page: number) => void;
}
export interface UseDebouncedSearchProps {
  value: string;
  delay?: number;
}
export interface EditableModalProps {
  isOpen: boolean;
  title: string;
  initialValues?: {
    name?: string;
    description?: string;
  };
  nameLabel?: string;
  descriptionLabel?: string;
  onSave: (values: { name: string; description: string }) => void;
  onClose: () => void;
}