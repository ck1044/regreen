import { useState } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface UseToastReturn {
  toast: (props: Omit<Toast, "id">) => void;
  toasts: Toast[];
  dismissToast: (id: string) => void;
}

// 간단한 구현의 toast 훅
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts((prev) => [...prev, newToast]);
    
    // 3초 후 자동으로 사라짐
    setTimeout(() => {
      dismissToast(id);
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toast,
    toasts,
    dismissToast,
  };
} 