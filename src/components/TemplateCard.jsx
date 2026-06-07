import { FileText, Send, Pencil, Trash2 } from 'lucide-react';

export default function TemplateCard({ template, onSend, onEdit, onDelete, deleting }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 truncate">{template.name}</h3>
          <p className="text-sm text-slate-500 truncate mt-0.5">{template.subject}</p>
          <p className="text-xs text-slate-400 mt-1 truncate">
            {template.resume_name || 'Resume'}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSend(template)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
        <button
          onClick={() => onEdit(template.id)}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(template.id)}
          disabled={deleting}
          className="flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
