import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatKES, isWindowOpen } from '../utils/format';
import { DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface CashOutFormProps {
  userProfile: UserProfile;
}

export const CashOutForm = ({ userProfile }: CashOutFormProps) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<'Task' | 'Referral'>('Task');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: ''
  });

  const isWithdrawalWindow = isWindowOpen();
  const availableBalance = source === 'Referral' ? userProfile.referral_balance : userProfile.task_balance;
  const minAmount = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const amountVal = parseFloat(amount);

    if (!isWithdrawalWindow) {
      setMessage({
        type: 'error',
        text: 'Cash out is only available Monday-Friday, 10 AM - 4 PM.'
      });
      return;
    }

    if (amountVal < minAmount) {
      setMessage({
        type: 'error',
        text: `Minimum cash out amount is ${formatKES(minAmount)}`
      });
      return;
    }

    if (amountVal > availableBalance) {
      setMessage({
        type: 'error',
        text: `Insufficient balance in ${source} Wallet`
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert([{
          user_id: userProfile.id,
          amount: amountVal,
          wallet_source: source,
          status: 'Pending'
        }]);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: `Cash out request for ${formatKES(amountVal)} submitted successfully! We'll process it within 24 hours.`
      });
      setAmount('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to submit cash out request'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Request Cash Out</h3>
          <p className="text-sm text-slate-600">Withdraw money to your M-PESA</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-start space-x-3">
        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            {isWithdrawalWindow ? (
              <span className="text-green-600">✓ Cash Out Window OPEN</span>
            ) : (
              <span className="text-amber-600">Cash Out Window CLOSED</span>
            )}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Available: Monday - Friday, 10:00 AM - 4:00 PM
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg border-2 flex items-start space-x-3 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm font-semibold ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Select Wallet
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as 'Task' | 'Referral')}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-semibold"
            disabled={loading}
          >
            <option value="Task">Task Wallet ({formatKES(userProfile.task_balance)})</option>
            <option value="Referral">Team Wallet ({formatKES(userProfile.referral_balance)})</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Available Balance
          </label>
          <div className="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-2xl font-extrabold text-green-700">
              {formatKES(availableBalance)}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Amount to Cash Out (KES)
          </label>
          <input
            type="number"
            placeholder={`Minimum ${minAmount}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-semibold text-lg"
            min={minAmount}
            max={availableBalance}
            step="50"
            disabled={loading}
          />
          <p className="text-xs text-slate-600 mt-1">
            Minimum: {formatKES(minAmount)} | Maximum: {formatKES(availableBalance)}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !isWithdrawalWindow || parseFloat(amount) < minAmount}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
        >
          {loading ? 'Submitting...' : 'Submit Cash Out Request'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
        <p className="text-xs font-bold text-amber-900 mb-2">Important Information:</p>
        <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
          <li>All requests are reviewed by our team</li>
          <li>Processing time: Within 24 hours on weekdays</li>
          <li>Money is sent directly to your registered phone number</li>
          <li>Minimum amount: {formatKES(minAmount)}</li>
        </ul>
      </div>
    </div>
  );
};
