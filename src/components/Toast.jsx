import { CheckCircle, XCircle, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export default function ToastContainer() {
  const { toasts, remove } = useToast();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-[280px] ${
            t.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
        >
          {t.type === 'error' ? (
            <XCircle className="h-5 w-5 shrink-0" />
          ) : (
            <CheckCircle className="h-5 w-5 shrink-0" />
          )}
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
