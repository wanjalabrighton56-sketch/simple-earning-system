import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onRegistrationComplete: (userId: string) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onRegistrationComplete, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [uplineUsername, setUplineUsername] = useState<string | null>(null);
  const [referralId, setReferralId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get('ref');
    if (refId) {
      setReferralId(refId);
      fetchUplineInfo(refId);
    }
  }, []);

  const fetchUplineInfo = async (refId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', refId)
      .maybeSingle();

    if (data) {
      setUplineUsername(data.username);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('Please enter your username');
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log('📝 REGISTER FORM: Starting registration...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            username: formData.username.trim(),
            phone: formData.phone.trim()
          }
        }
      });

      if (authError) {
        console.error('📝 REGISTER FORM: Auth error:', authError);
        throw authError;
      }
      if (!authData.user) throw new Error('Registration failed. Please try again.');

      console.log('📝 REGISTER FORM: User created, ID:', authData.user.id);

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          referred_by: referralId,
          is_activated: false,
          balance: 0,
          task_balance: 0,
          referral_balance: 0,
          wallet_balance: 0,
          total_earnings: 0,
          total_referrals: 0,
          active_referrals: 0,
          referral_earnings: 0,
          level1_count: 0,
          level2_count: 0,
          level3_count: 0,
          expenses: 500 // Initial expense
        }]);

      if (profileError) {
        console.error('📝 REGISTER FORM: Profile error:', profileError);
      }

      console.log('📝 REGISTER FORM: Success! Calling completion callback...');
      onRegistrationComplete(authData.user.id);
    } catch (err: any) {
      console.error('📝 REGISTER FORM: Final error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-white via-green-50 to-white rounded-2xl shadow-2xl p-8 border-2 border-green-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join SmartPay!</h1>
          <p className="text-slate-600">Start earning today with simple tasks</p>
        </div>

        {uplineUsername && referralId && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-800 text-center">
              Invited by: <span className="font-bold">{uplineUsername}</span>
            </p>
            <p className="text-xs text-green-700 text-center mt-1">
              You'll be part of their team after activation
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegistrationSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose your username"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0712345678"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              disabled={loading}
            />
            <label className="text-sm text-slate-700">
              I agree to the <span className="text-green-600 font-semibold">Terms & Conditions</span> and <span className="text-green-600 font-semibold">Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg flex items-center justify-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 font-semibold hover:text-green-700 transition duration-200"
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
