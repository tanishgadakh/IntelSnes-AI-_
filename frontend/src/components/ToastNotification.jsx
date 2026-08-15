import toast, { Toaster } from 'react-hot-toast';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const showToast = {
  success: (message) =>
    toast.success(message, {
      icon: <CheckCircle size={20} />,
      duration: 3000,
    }),
  error: (message) =>
    toast.error(message, {
      icon: <AlertCircle size={20} />,
      duration: 4000,
    }),
  info: (message) =>
    toast.custom((t) => (
      <div className="toast-custom toast-info">
        <Info size={20} />
        <span>{message}</span>
      </div>
    ), {
      duration: 3000,
    }),
  warning: (message) =>
    toast.custom((t) => (
      <div className="toast-custom toast-warning">
        <AlertTriangle size={20} />
        <span>{message}</span>
      </div>
    ), {
      duration: 3000,
    }),
  loading: (message) => toast.loading(message),
  dismiss: toast.dismiss,
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        className: 'toast-container',
        style: {
          background: '#fff',
          color: '#000',
          borderRadius: '8px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
          padding: '12px 16px',
        },
      }}
    />
  );
}
