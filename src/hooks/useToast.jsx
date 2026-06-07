import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const show = useCallback(
    (message, type = 'success') => {
      const toastId = ++id;
      setToasts((prev) => [...prev, { id: toastId, message, type }]);
      setTimeout(() => remove(toastId), 3500);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toasts, show, remove }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast requires ToastProvider');
  return ctx;
}
