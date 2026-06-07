import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendEmailSchema } from '../utils/schemas';
import { sendEmail } from '../services/emailService';
import { useToast } from '../hooks/useToast';
import Modal from './Modal';

export default function SendEmailModal({ template, open, onClose }) {
  const { show } = useToast();
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sendEmailSchema),
    defaultValues: { recipientEmail: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async ({ recipientEmail }) => {
    if (!template) return;
    setSending(true);
    try {
      const result = await sendEmail({
        recipientEmail,
        subject: template.subject,
        body: template.body,
        resumeUrl: template.resume_url,
        resumeName: template.resume_name,
      });
      show(result.message);
      handleClose();
    } catch (err) {
      show(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  if (!template) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Send Application">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-lg bg-slate-50 p-3 text-sm space-y-1">
          <p>
            <span className="text-slate-500">Subject:</span>{' '}
            <span className="text-slate-800">{template.subject}</span>
          </p>
          <p>
            <span className="text-slate-500">Resume:</span>{' '}
            <span className="text-slate-800">{template.resume_name}</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Recipient Email
          </label>
          <input
            type="email"
            placeholder="recruiter@company.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('recipientEmail')}
          />
          {errors.recipientEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.recipientEmail.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
