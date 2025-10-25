import { useState } from 'react';
import { UserProfile } from '../types';
import { Share2, Copy, Check, Facebook, Twitter, Mail, MessageCircle } from 'lucide-react';

interface InviteFriendsPageProps {
  userProfile: UserProfile;
}

export const InviteFriendsPage = ({ userProfile }: InviteFriendsPageProps) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}?ref=${userProfile.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareVia = (platform: string) => {
    const message = `Join me on this amazing earning platform! Use my referral link to get started: ${referralLink}`;
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      email: `mailto:?subject=Join%20Our%20Earning%20Platform&body=${encodeURIComponent(message)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Share2 className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-slate-900">Invite Friends</h1>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm font-semibold opacity-90">Total Referrals</p>
          <p className="text-4xl font-bold mt-2">{userProfile.total_referrals || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm font-semibold opacity-90">Active Referrals</p>
          <p className="text-4xl font-bold mt-2">{userProfile.active_referrals || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm font-semibold opacity-90">Referral Earnings</p>
          <p className="text-4xl font-bold mt-2">
            KES {userProfile.referral_earnings?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Referral Link</h2>
        <p className="text-slate-600 mb-4">
          Share this link with your friends and earn commissions when they activate their accounts!
        </p>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-700 font-mono text-sm"
          />
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => shareVia('whatsapp')}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>
          
          <button
            onClick={() => shareVia('facebook')}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </button>
          
          <button
            onClick={() => shareVia('twitter')}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition"
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter</span>
          </button>
          
          <button
            onClick={() => shareVia('email')}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">How Referrals Work</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Share Your Link</h3>
              <p className="text-slate-600 text-sm">
                Copy and share your unique referral link with friends and family
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">They Sign Up</h3>
              <p className="text-slate-600 text-sm">
                Your friends register using your referral link
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">They Activate</h3>
              <p className="text-slate-600 text-sm">
                When they pay the KES 500 activation fee, you earn a commission
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Earn Commissions</h3>
              <p className="text-slate-600 text-sm">
                Receive instant commissions in your wallet for each successful referral
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Commission Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <h3 className="font-bold text-green-600 mb-2">Level 1 (Direct Referrals)</h3>
            <p className="text-2xl font-bold text-slate-900">KES 100</p>
            <p className="text-sm text-slate-600 mt-1">Per activation</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <h3 className="font-bold text-blue-600 mb-2">Level 2 (Indirect Referrals)</h3>
            <p className="text-2xl font-bold text-slate-900">KES 50</p>
            <p className="text-sm text-slate-600 mt-1">Per activation</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-semibold">
            💡 Tip: The more people you refer, the more you earn! Build your team and watch your earnings grow.
          </p>
        </div>
      </div>
    </div>
  );
};
