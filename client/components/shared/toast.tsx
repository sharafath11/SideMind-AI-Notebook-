import { CustomAlert } from "@/components/shared/CustomAlert";
import toast, { Toast } from "react-hot-toast";

export const showSuccessToast = (msg: string | undefined, duration = 4000): string => {
  const message = msg || "Operation successful";
  
  return toast.custom((t: Toast) => (
    <CustomAlert
      toastId={t.id} 
      variant="success"
      description={message}
      title="Success"
      onClose={() => toast.dismiss(t.id)} 
    />
  ), {
    duration: duration,
    style: { 
        padding: 0, 
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: '0.75rem' 
    }
  });
};

export const showErrorToast = (msg: string | undefined, duration = 4000): string => {
  const message = msg || "An unexpected error occurred";

  return toast.custom((t: Toast) => (
    <CustomAlert
      toastId={t.id}
      variant="error"
      description={message}
      title="Error"
      onClose={() => toast.dismiss(t.id)}
    />
  ), {
    duration: duration,
    style: { 
        padding: 0, 
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: '0.75rem' 
    }
  });
};

export const showInfoToast = (msg: string | undefined, duration = 4000): string => {
  const message = msg || "Something happened";

  return toast.custom((t: Toast) => (
    <CustomAlert
      toastId={t.id}
      variant="info"
      description={message}
      title="Information"
      onClose={() => toast.dismiss(t.id)}
    />
  ), {
    duration: duration,
    style: { 
        padding: 0, 
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: '0.75rem'
    }
  });
};