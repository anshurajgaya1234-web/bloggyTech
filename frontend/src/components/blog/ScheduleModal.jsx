import React, { useState } from 'react';
import { Calendar, Clock, X, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { postsApi } from '../../api/posts';

export const ScheduleModal = ({ isOpen, post, onClose, onScheduled }) => {
  const { success, error } = useToast();
  const [scheduleDateTime, setScheduleDateTime] = useState(() => {
    if (post?.scheduledPublished) {
      const d = new Date(post.scheduledPublished);
      return d.toISOString().slice(0, 16);
    }
    // default to tomorrow at 9 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen || !post) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const targetDate = new Date(scheduleDateTime);
    if (isNaN(targetDate.getTime())) {
      setValidationError('Please select a valid date and time');
      return;
    }
    if (targetDate <= new Date()) {
      setValidationError('Scheduled publication date must be in the future');
      return;
    }

    setIsLoading(true);
    try {
      await postsApi.schedulePost(post._id, targetDate.toISOString());
      success(`Article scheduled for ${targetDate.toLocaleDateString()} at ${targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      if (onScheduled) onScheduled();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to schedule article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-border shadow-elevated max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-content">Schedule Article</h3>
              <p className="text-xs text-content-secondary truncate max-w-xs">{post.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-content-muted hover:text-content p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <p className="text-xs text-content-secondary leading-relaxed">
              Choose the date and time when your article should become publicly visible to readers across the platform.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-content block">Publish Date & Time</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => {
                    setScheduleDateTime(e.target.value);
                    setValidationError('');
                  }}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full p-2.5 text-xs bg-canvas-subtle border border-border rounded-lg text-content focus:outline-none focus:border-brand-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            {validationError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-4 bg-canvas-subtle border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-white text-content hover:bg-canvas-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-subtle disabled:opacity-50"
            >
              {isLoading ? 'Scheduling...' : 'Set Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;

