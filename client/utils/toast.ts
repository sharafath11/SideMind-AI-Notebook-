import toast from "react-hot-toast";

export const showSuccessToast = (msg?: string, duration = 4000) =>
  toast.success(msg || "Something went wrong", { duration });

export const showErrorToast = (msg?: string, duration = 4000) =>
  toast.error(msg || "Something went wrong", { duration });

export const showInfoToast = (msg?: string, duration = 4000) =>
  toast(msg || "Something happened", { icon: "ℹ️", duration });


