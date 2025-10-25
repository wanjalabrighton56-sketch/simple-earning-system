import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus } from 'lucide-react';

interface RegistrationPageProps {
  onRegistrationComplete: (userId: string) => void;
}

export const RegistrationPage = ({ onRegistrationComplete }: RegistrationPageProps) => {
  const [isLogin, setIsLogin] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Login failed. Please try again.');
      }

      onRegistrationComplete(authData.user.id);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      return handleLogin(e);
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log('Starting registration process...');
      
      // Quick registration without complex timeouts
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            username: formData.username,
            phone: formData.phone
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed. Please try again.');

      console.log('Creating user profile...');

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
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
          level3_count: 0
        }]);

      if (profileError) {
        console.error('Profile error:', profileError);
        // If profile creation fails, still proceed (user can be fixed later)
      }

      console.log('Registration successful!');
      onRegistrationComplete(authData.user.id);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join Our Team'}
            </h1>
            <p className="text-slate-600">
              {isLogin ? 'Sign in to your account' : 'Start earning today with simple tasks'}
            </p>
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
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
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07xxxxxxxx"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none text-slate-900 font-medium"
                  disabled={loading}
                />
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                  disabled={loading}
                />
                <label htmlFor="terms" className="ml-3 text-sm text-slate-700">
                  I accept the <span className="font-semibold text-green-600">terms and conditions</span> and understand I need to pay KES 500 activation fee
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg flex items-center justify-center space-x-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>
                {loading 
                  ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </span>
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData(prev => ({ ...prev, username: '', phone: '', confirmPassword: '' }));
              }}
              className="font-semibold text-green-600 hover:text-green-700"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
