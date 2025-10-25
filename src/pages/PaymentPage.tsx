import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatPhoneNumber } from '../utils/format';
import { ACTIVATION_FEE } from '../types';
import { Wallet, CheckCircle, XCircle, Loader } from 'lucide-react';

interface PaymentPageProps {
  userId: string;
  onPaymentComplete: () => void;
}

export const PaymentPage = ({ userId, onPaymentComplete }: PaymentPageProps) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'pending' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [externalRef, setExternalRef] = useState<string | null>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (externalRef && status.type === 'pending') {
      pollInterval = setInterval(() => {
        checkPaymentStatus(externalRef);
      }, 5000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [externalRef, status.type]);

  const checkPaymentStatus = async (reference: string) => {
    const { data } = await supabase
      .from('activation_payments')
      .select('status, confirmed_at')
      .eq('external_reference', reference)
      .maybeSingle();

    if (data?.status === 'SUCCESS' && data.confirmed_at) {
      setStatus({
        type: 'success',
        message: 'Payment confirmed! Your account is now active.',
      });

      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    } else if (data?.status === 'FAILED') {
      setStatus({
        type: 'error',
        message: 'Payment failed or was cancelled. Please try again.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!phone.trim()) {
      setStatus({ type: 'error', message: 'Please enter your phone number' });
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    if (formattedPhone.length < 12) {
      setStatus({ type: 'error', message: 'Please enter a valid phone number' });
      return;
    }

    setLoading(true);

    try {
      const reference = `ACTIVATION_${userId.substring(0, 8)}_${Date.now()}`;
      setExternalRef(reference);

      const { error: insertError } = await supabase
        .from('activation_payments')
        .insert([{
          user_id: userId,
          phone_number: formattedPhone,
          amount: ACTIVATION_FEE,
          external_reference: reference,
          status: 'QUEUED',
        }]);

      if (insertError) throw insertError;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: ACTIVATION_FEE,
          reference: reference,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Payment initiation failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.status && result.status.toLowerCase() === 'queued') {
        setStatus({
          type: 'pending',
          message: 'Payment request sent! Please check your phone and enter your M-PESA PIN.',
        });

        await supabase
          .from('activation_payments')
          .update({
            checkout_request_id: result.checkoutRequestID,
          })
          .eq('external_reference', reference);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to initiate payment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Account Activation
            </h1>
            <p className="text-slate-600 mb-4">
              One-time payment to unlock your earning account
            </p>
            <div className="inline-block bg-green-100 px-6 py-3 rounded-lg">
              <p className="text-sm text-green-700 font-semibold">Activation Fee</p>
              <p className="text-4xl font-bold text-green-700">
                KES {ACTIVATION_FEE}
              </p>
            </div>
          </div>

          {status.type !== 'idle' && (
            <div
              className={`mb-6 p-4 rounded-lg border-2 flex items-start space-x-3 ${
                status.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : status.type === 'error'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              {status.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              {status.type === 'error' && (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              {status.type === 'pending' && (
                <Loader className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
              )}
              <p
                className={`text-sm font-semibold ${
                  status.type === 'success'
                    ? 'text-green-800'
                    : status.type === 'error'
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}
              >
                {status.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                M-PESA Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07xxxxxxxx or 2547xxxxxxxx"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 font-medium text-lg"
                disabled={loading || status.type === 'pending'}
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter the M-PESA number you'll use to pay
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || status.type === 'pending' || status.type === 'success'}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
            >
              {loading
                ? 'Sending Payment Request...'
                : status.type === 'pending'
                ? 'Waiting for Payment...'
                : `Pay KES ${ACTIVATION_FEE}`}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 font-semibold mb-2">
              How it works:
            </p>
            <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
              <li>Enter your M-PESA phone number</li>
              <li>Click the pay button</li>
              <li>Check your phone for the M-PESA prompt</li>
              <li>Enter your M-PESA PIN to confirm</li>
              <li>Your account will be activated instantly</li>
            </ol>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Powered by PayHero - Secure payments
          </p>
        </div>
      </div>
    </div>
  );
};
