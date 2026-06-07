import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, AlertCircle } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import { useToast } from '../hooks/useToast';
import TemplateCard from '../components/TemplateCard';
import SendEmailModal from '../components/SendEmailModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { show } = useToast();
  const { templates, loading, error, remove } = useTemplates();
  const [sendTemplate, setSendTemplate] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    setDeletingId(id);
    try {
      await remove(id);
      show('Template deleted.');
    } catch (err) {
      show(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Templates</h2>
          <p className="text-sm text-slate-500 mt-1">
            Save and send job application emails with one click
          </p>
        </div>
        <button
          onClick={() => navigate('/template')}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!error && templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No templates yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Create your first template with a subject, message, and resume.
          </p>
          <button
            onClick={() => navigate('/template')}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSend={setSendTemplate}
              onEdit={(id) => navigate(`/template?id=${id}`)}
              onDelete={handleDelete}
              deleting={deletingId === template.id}
            />
          ))}
        </div>
      )}

      <SendEmailModal
        template={sendTemplate}
        open={!!sendTemplate}
        onClose={() => setSendTemplate(null)}
      />
    </div>
  );
}
