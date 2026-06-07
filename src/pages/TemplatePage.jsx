import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { templateSchema } from '../utils/schemas';
import { buildTemplateFormData, validateResumeFile } from '../utils/helpers';
import { createTemplate, updateTemplate, fetchTemplates } from '../services/templateService';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TemplatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEditing = Boolean(editId);

  const { show } = useToast();
  const fileRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: { name: '', subject: '', body: '' },
  });

  useEffect(() => {
    if (!editId) return;
    fetchTemplates()
      .then((templates) => {
        const template = templates.find((t) => t.id === editId);
        if (!template) {
          show('Template not found.', 'error');
          navigate('/');
          return;
        }
        reset({ name: template.name, subject: template.subject, body: template.body });
        setExistingResume({
          name: template.resume_name,
          url: template.resume_url,
        });
      })
      .catch((err) => show(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [editId, reset, navigate, show]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateResumeFile(file);
    if (err) {
      setResumeError(err);
      e.target.value = '';
      return;
    }
    setResumeFile(file);
    setResumeError('');
    e.target.value = '';
  };

  const onSubmit = async (formData) => {
    if (!resumeFile && !existingResume) {
      setResumeError('Resume is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = buildTemplateFormData({
        ...formData,
        resume: resumeFile || undefined,
      });

      if (isEditing) {
        await updateTemplate(editId, payload);
        show('Template updated.');
      } else {
        if (!resumeFile) {
          setResumeError('Resume is required.');
          setSaving(false);
          return;
        }
        await createTemplate(payload);
        show('Template created.');
      }
      navigate('/');
    } catch (err) {
      show(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isEditing ? 'Edit Template' : 'Create Template'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Save your email template and resume for quick applications
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Template Name
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Software Engineer Outreach"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Application for Software Engineer Position"
            {...register('subject')}
          />
          {errors.subject && (
            <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Message Body
          </label>
          <textarea
            rows={10}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="Dear Hiring Manager..."
            {...register('body')}
          />
          {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Resume (PDF, max 5MB)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {resumeFile || existingResume ? (
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <FileText className="h-5 w-5 text-red-500 shrink-0" />
              <span className="text-sm text-slate-700 truncate flex-1">
                {resumeFile?.name || existingResume?.name}
              </span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-sm text-blue-600 hover:underline shrink-0"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-8 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
            >
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="text-sm text-slate-500">Click to upload PDF</span>
            </button>
          )}
          {resumeError && <p className="text-xs text-red-500 mt-1">{resumeError}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </form>
    </div>
  );
}
