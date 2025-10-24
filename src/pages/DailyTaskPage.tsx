import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { isWindowOpen } from '../utils/format';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface DailyTaskPageProps {
  userId: string;
}

export const DailyTaskPage = ({ userId }: DailyTaskPageProps) => {
  const [submission, setSubmission] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ canSubmit: false, message: '' });

  const dailyQuestion = useMemo(
    () =>
      'Write a simple article (250+ words) about three popular mobile banking apps in Kenya and why they are successful.',
    []
  );

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    const now = new Date();
    const isSubmissionWindow = isWindowOpen(now);

    const checkSubmissionStatus = async () => {
      const { data } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_date', today)
        .maybeSingle();

      if (data) {
        setStatus({
          canSubmit: false,
          message: 'Task submitted for today! Check back for approval and payment.'
        });
      } else if (!isSubmissionWindow) {
        setStatus({
          canSubmit: false,
          message: 'Task submission is closed. Open daily 10 AM - 4 PM (Mon-Fri).'
        });
      } else {
        setStatus({
          canSubmit: true,
          message: 'Task submission is currently OPEN. Submit now to earn KES 100!'
        });
      }
    };

    checkSubmissionStatus();
  }, [userId, today]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const wordCount = submission.split(/\s+/).filter((w) => w.length > 0).length;

    if (wordCount < 250) {
      alert('Your submission must be at least 250 words.');
      return;
    }

    if (!status.canSubmit) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('daily_tasks').insert([
        {
          user_id: userId,
          task_date: today,
          question: dailyQuestion,
          content: submission,
          word_count: wordCount,
          status: 'Pending Review'
        }
      ]);

      if (error) throw error;

      setStatus({
        canSubmit: false,
        message: 'Success! Your task is submitted. We will review and process payment within 24 hours.'
      });
      setSubmission('');
    } catch (error: any) {
      alert(error.message || 'Failed to submit task');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = submission.split(/\s+/).filter((w) => w.length > 0).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Daily Writing Task</h2>
        <p className="text-slate-600">Complete today's task and earn KES 100</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Task for {today}</h3>
            <p className="text-sm text-slate-600">Write at least 250 words</p>
          </div>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-start space-x-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p
              className={`text-sm font-semibold ${
                status.canSubmit ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              {status.message}
            </p>
          </div>
        </div>

        <div className="mb-4 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
          <p className="text-sm font-bold text-slate-700 mb-2">Today's Question:</p>
          <p className="text-base text-slate-900">{dailyQuestion}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Your Article
            </label>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Start writing your 250+ word article here..."
              className="w-full h-64 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 resize-none"
              disabled={!status.canSubmit || loading}
            />
            <div className="flex justify-between items-center mt-2">
              <span
                className={`text-sm font-semibold ${
                  wordCount >= 250 ? 'text-green-600' : 'text-slate-600'
                }`}
              >
                Word Count: {wordCount} / 250
                {wordCount >= 250 && ' ✓'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!status.canSubmit || wordCount < 250 || loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
          >
            {loading ? 'Submitting...' : 'Submit Task (Earn KES 100)'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-xs font-bold text-green-900 mb-2">Payment Information:</p>
          <ul className="text-xs text-green-800 space-y-1 list-disc list-inside">
            <li>Each approved task earns you KES 100</li>
            <li>Payment is added to your Task Wallet</li>
            <li>Tasks are reviewed within 24 hours</li>
            <li>One task per day allowed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
