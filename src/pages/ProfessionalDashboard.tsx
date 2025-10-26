import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  TrendingUp, Users, DollarSign, Target, Award, Zap,
  Trophy, Gift, Star, Sparkles, Rocket, Crown, Gem,
  CreditCard, PiggyBank, TrendingDown, Eye, Bell,
  ArrowUp, ArrowDown, Activity, BarChart3, Wallet
} from 'lucide-react';

type Page = 'Dashboard' | 'Daily Task' | 'My Team' | 'Invite Friends' | 'Cash Out' | 'History' | 'Marketing Hub' | 'Training Hub';

interface ProfessionalDashboardProps {
  userProfile: UserProfile;
  onNavigate: (page: Page) => void;
}

export const ProfessionalDashboard = ({ userProfile, onNavigate }: ProfessionalDashboardProps) => {
  const [time, setTime] = useState(new Date());
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedEarnings(prev => {
        if (prev < userProfile.total_earnings) {
          return Math.min(prev + Math.ceil(userProfile.total_earnings / 50), userProfile.total_earnings);
        }
        return prev;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [userProfile.total_earnings]);

  // Mock withdrawal notifications
  useEffect(() => {
    const showMockNotification = () => {
      if (Math.random() > 0.7) { // 30% chance
        const amounts = [2500, 5000, 1200, 3500, 7500];
        const phones = ['0745***776', '0712***234', '0798***567', '0701***890'];
        const amount = amounts[Math.floor(Math.random() * amounts.length)];
        const phone = phones[Math.floor(Math.random() * phones.length)];
        
        const notification = `KES ${amount.toLocaleString()} sent to ${phone}`;
        setNotifications(prev => [notification, ...prev.slice(0, 2)]);
        setShowNotification(true);
        
        setTimeout(() => setShowNotification(false), 4000);
      }
    };

    const interval = setInterval(showMockNotification, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const totalTeam = userProfile.level1_count + userProfile.level2_count + userProfile.level3_count;
  const profitLoss = userProfile.total_earnings - (userProfile.expenses || 500);
  const profitPercentage = ((profitLoss / (userProfile.expenses || 500)) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Fixed Viewport Meta for Mobile */}
      <style>{`
        @media (max-width: 768px) {
          body { 
            overflow-x: hidden; 
            -webkit-text-size-adjust: 100%;
            -webkit-user-select: none;
            user-select: none;
            zoom: 1;
            -webkit-touch-callout: none;
          }
          * {
            -webkit-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
          }
          input, textarea {
            -webkit-user-select: text;
            user-select: text;
          }
        }
        
        /* Disable zoom */
        html {
          touch-action: manipulation;
          -ms-touch-action: manipulation;
        }
        
        /* Professional animations */
        @keyframes slideInFromTop {
          0% { transform: translateY(-100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-200px) scale(1.2); opacity: 0; }
        }
        
        .notification-float {
          animation: floatUp 4s ease-out forwards;
        }
        
        .glow-card {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        
        .slide-in {
          animation: slideInFromTop 0.6s ease-out;
        }
      `}</style>

      {/* Floating Notifications */}
      {showNotification && notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          {notifications.slice(0, 1).map((notification, index) => (
            <div
              key={index}
              className="notification-float bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-2xl border-2 border-green-300"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">✅ {notification}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Professional Header */}
      <div className="relative z-10 p-4 md:p-6">
        <div className="slide-in">
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-purple-500/30 glow-card">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                  <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
                  <h1 className="text-2xl md:text-4xl font-black text-white">
                    Welcome, <span className="text-yellow-400">{userProfile.username}</span>!
                  </h1>
                  <Sparkles className="w-6 h-6 text-pink-400 animate-spin" />
                </div>
                <p className="text-lg md:text-xl text-purple-200 font-bold mb-4">
                  🚀 Elite Member Dashboard - {time.toLocaleTimeString()}
                </p>
                
                {/* Profit/Loss Indicator */}
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <div className={`px-4 py-2 rounded-full border-2 ${
                    profitLoss >= 0 
                      ? 'bg-green-500/20 border-green-400 text-green-300' 
                      : 'bg-red-500/20 border-red-400 text-red-300'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {profitLoss >= 0 ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span className="font-bold">
                        {profitLoss >= 0 ? 'PROFIT' : 'LOSS'}: KES {Math.abs(profitLoss).toLocaleString()}
                      </span>
                      <span className="text-sm">({profitPercentage}%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500">
                    <Trophy className="w-16 h-16 text-white mx-auto mb-2" />
                    <p className="text-white font-black text-center text-lg">ELITE</p>
                    <p className="text-yellow-200 font-black text-center text-2xl">MEMBER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-6">
          <ProfessionalStatCard
            icon={<DollarSign className="w-6 h-6 md:w-8 h-8" />}
            title="Total Earnings"
            value={`KES ${animatedEarnings.toLocaleString()}`}
            gradient="from-emerald-600 via-green-500 to-teal-600"
            change="+12.5%"
            delay="0s"
          />
          <ProfessionalStatCard
            icon={<CreditCard className="w-6 h-6 md:w-8 h-8" />}
            title="Total Expenses"
            value={`KES ${(userProfile.expenses || 500).toLocaleString()}`}
            gradient="from-red-600 via-pink-500 to-rose-600"
            change="-2.1%"
            delay="0.1s"
          />
          <ProfessionalStatCard
            icon={<Users className="w-6 h-6 md:w-8 h-8" />}
            title="Team Power"
            value={`${totalTeam} Members`}
            gradient="from-blue-600 via-cyan-500 to-sky-600"
            change="+8.3%"
            delay="0.2s"
          />
          <ProfessionalStatCard
            icon={<Target className="w-6 h-6 md:w-8 h-8" />}
            title="Success Rate"
            value="98.7%"
            gradient="from-purple-600 via-indigo-500 to-blue-600"
            change="+0.5%"
            delay="0.3s"
          />
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Earnings vs Expenses Chart */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl shadow-2xl p-6 border-4 border-slate-600/50">
            <h3 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <span>Financial Overview</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-bold">Earnings</span>
                <span className="text-white font-black text-lg">KES {userProfile.total_earnings.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: '75%' }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold">Expenses</span>
                <span className="text-white font-black text-lg">KES {(userProfile.expenses || 500).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: '25%' }}
                ></div>
              </div>
              
              <div className="pt-4 border-t border-slate-600">
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Net {profitLoss >= 0 ? 'Profit' : 'Loss'}
                  </span>
                  <span className={`font-black text-xl ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    KES {Math.abs(profitLoss).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Breakdown */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl shadow-2xl p-6 border-4 border-slate-600/50">
            <h3 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center space-x-2">
              <Wallet className="w-6 h-6 text-purple-400" />
              <span>Wallet Breakdown</span>
            </h3>
            <div className="space-y-4">
              <WalletCard3D
                title="Task Wallet"
                amount={userProfile.task_balance}
                icon={<Gift className="w-6 h-6" />}
                color="from-green-500 to-emerald-600"
              />
              <WalletCard3D
                title="Referral Wallet"
                amount={userProfile.referral_balance}
                icon={<Users className="w-6 h-6" />}
                color="from-blue-500 to-cyan-600"
              />
              <WalletCard3D
                title="Total Balance"
                amount={userProfile.balance}
                icon={<Gem className="w-6 h-6" />}
                color="from-purple-500 to-pink-600"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl shadow-2xl p-6 border-4 border-slate-600/50">
            <h3 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton
                icon={<Gift className="w-6 h-6" />}
                label="Daily Task"
                gradient="from-green-500 to-emerald-600"
                onClick={() => onNavigate('Daily Task')}
              />
              <QuickActionButton
                icon={<Users className="w-6 h-6" />}
                label="My Team"
                gradient="from-blue-500 to-cyan-600"
                onClick={() => onNavigate('My Team')}
              />
              <QuickActionButton
                icon={<Rocket className="w-6 h-6" />}
                label="Invite"
                gradient="from-purple-500 to-pink-600"
                onClick={() => onNavigate('Invite Friends')}
              />
              <QuickActionButton
                icon={<DollarSign className="w-6 h-6" />}
                label="Cash Out"
                gradient="from-orange-500 to-red-600"
                onClick={() => onNavigate('Cash Out')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessionalStatCard = ({ icon, title, value, gradient, change, delay }: any) => (
  <div className="relative group" style={{ animationDelay: delay }}>
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}></div>
    <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl shadow-2xl p-4 md:p-6 transform hover:scale-105 transition-all duration-500 border-4 border-white/20`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
          {icon}
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
          change.startsWith('+') ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'
        }`}>
          {change}
        </div>
      </div>
      <p className="text-white/80 font-bold text-xs md:text-sm mb-2">{title}</p>
      <p className="text-white font-black text-lg md:text-2xl">{value}</p>
    </div>
  </div>
);

const WalletCard3D = ({ title, amount, icon, color }: any) => (
  <div className="relative group">
    <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}></div>
    <div className={`relative bg-gradient-to-br ${color} rounded-xl shadow-xl p-4 transform hover:scale-105 transition-all duration-300 border-2 border-white/20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-white/80 font-bold text-sm">{title}</p>
            <p className="text-white font-black text-lg">KES {amount.toLocaleString()}</p>
          </div>
        </div>
        <Eye className="w-5 h-5 text-white/60" />
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, gradient, onClick }: any) => (
  <button
    onClick={onClick}
    className={`relative group bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-4 md:p-6 transform hover:scale-105 transition-all duration-300 border-2 border-white/20`}
  >
    <div className="flex flex-col items-center space-y-2">
      <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
        {icon}
      </div>
      <span className="text-white font-bold text-sm md:text-base">{label}</span>
    </div>
  </button>
);
