import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatKES } from '../utils/format';
import { UserProfile, COMMISSION_RATES } from '../types';
import { Users, TrendingUp } from 'lucide-react';

interface MyTeamPageProps {
  userProfile: UserProfile;
  userId: string;
}

export const MyTeamPage = ({ userProfile, userId }: MyTeamPageProps) => {
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const link = `${window.location.origin}?ref=${userId}`;
    setReferralLink(link);
  }, [userId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levelEarnings = [
    {
      level: 1,
      name: 'Direct Team',
      count: userProfile.level1_count,
      commission: COMMISSION_RATES.LEVEL_1,
      total: userProfile.level1_count * COMMISSION_RATES.LEVEL_1,
      color: 'green'
    },
    {
      level: 2,
      name: 'Level 2 Team',
      count: userProfile.level2_count,
      commission: COMMISSION_RATES.LEVEL_2,
      total: userProfile.level2_count * COMMISSION_RATES.LEVEL_2,
      color: 'blue'
    },
    {
      level: 3,
      name: 'Level 3 Team',
      count: userProfile.level3_count,
      commission: COMMISSION_RATES.LEVEL_3,
      total: userProfile.level3_count * COMMISSION_RATES.LEVEL_3,
      color: 'purple'
    }
  ];

  const totalTeamSize =
    userProfile.level1_count + userProfile.level2_count + userProfile.level3_count;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">My Team</h2>
        <p className="text-slate-600">View your team structure and earnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Your Team Link</h3>
              <p className="text-sm text-slate-600">Share to grow your team</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Your Unique Link
              </label>
              <div className="flex">
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-l-lg text-sm font-mono text-slate-700 truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-r-lg transition"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-xs font-bold text-blue-900 mb-2">How it works:</p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>Share your link on WhatsApp, Facebook, or any platform</li>
                <li>When someone joins using your link, they become your team member</li>
                <li>You earn when they activate their account (KES {COMMISSION_RATES.LEVEL_1})</li>
                <li>You also earn from their team members (Levels 2 & 3)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Total Team Size</h3>
              <p className="text-sm text-green-100">All levels combined</p>
            </div>
          </div>
          <p className="text-6xl font-extrabold mb-2">{totalTeamSize}</p>
          <p className="text-lg font-semibold text-green-100">Active Members</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Team Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levelEarnings.map((level) => (
            <div
              key={level.level}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${level.color}-500 transform hover:scale-105 transition duration-200`}
            >
              <div className="text-center mb-4">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 bg-${level.color}-100 text-${level.color}-600 rounded-full font-bold text-xl mb-2`}
                >
                  L{level.level}
                </div>
                <h4 className="text-lg font-bold text-slate-900">{level.name}</h4>
              </div>

              <div className="space-y-3">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 font-semibold mb-1">Team Members</p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    {level.count.toLocaleString()}
                  </p>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700 font-semibold mb-1">Commission Per Member</p>
                  <p className={`text-2xl font-extrabold text-${level.color}-600`}>
                    {formatKES(level.commission)}
                  </p>
                </div>

                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 font-semibold mb-1">Total Earned (L{level.level})</p>
                  <p className="text-2xl font-extrabold text-blue-600">
                    {formatKES(level.total)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Commission Structure</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="font-bold text-slate-900">Level 1 - Direct Team</p>
              <p className="text-sm text-slate-600">People who join using your link</p>
            </div>
            <p className="text-2xl font-extrabold text-green-600">
              {formatKES(COMMISSION_RATES.LEVEL_1)}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-bold text-slate-900">Level 2 - Indirect Team</p>
              <p className="text-sm text-slate-600">People your direct team brings in</p>
            </div>
            <p className="text-2xl font-extrabold text-blue-600">
              {formatKES(COMMISSION_RATES.LEVEL_2)}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="font-bold text-slate-900">Level 3 - Extended Network</p>
              <p className="text-sm text-slate-600">People your Level 2 team brings in</p>
            </div>
            <p className="text-2xl font-extrabold text-purple-600">
              {formatKES(COMMISSION_RATES.LEVEL_3)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
