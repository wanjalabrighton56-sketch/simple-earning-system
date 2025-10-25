import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  TrendingUp, Users, DollarSign, Target, Award, Zap,
  Trophy, Gift, Star, Sparkles, Rocket, Crown, Gem
} from 'lucide-react';

type Page = 'Dashboard' | 'Daily Task' | 'My Team' | 'Invite Friends' | 'Cash Out' | 'History' | 'Marketing Hub' | 'Training Hub';

interface UltraDashboardPageProps {
  userProfile: UserProfile;
  onNavigate: (page: Page) => void;
}

export const UltraDashboardPage = ({ userProfile, onNavigate }: UltraDashboardPageProps) => {
  const [time, setTime] = useState(new Date());
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  
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

  const totalTeam = userProfile.level1_count + userProfile.level2_count + userProfile.level3_count;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Hero Section with 3D Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="w-12 h-12 text-yellow-200 animate-bounce" />
                  <h1 className="text-5xl font-black text-white drop-shadow-2xl animate-gradient">
                    Welcome, {userProfile.username}!
                  </h1>
                  <Sparkles className="w-8 h-8 text-yellow-200 animate-spin-slow" />
                </div>
                <p className="text-2xl text-yellow-100 font-bold animate-pulse">
                  🚀 You're crushing it! Keep going! 🔥
                </p>
                <div className="flex items-center space-x-4">
                  <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 shadow-xl">
                    <p className="text-white font-bold text-lg">
                      {time.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 shadow-xl animate-pulse">
                    <p className="text-white font-bold text-lg flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-300 animate-bounce" />
                      <span>RANK #{Math.floor(Math.random() * 100) + 1}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <Trophy className="w-24 h-24 text-yellow-200 animate-bounce" />
                    <p className="text-white font-black text-3xl mt-4">TOP</p>
                    <p className="text-yellow-200 font-black text-5xl">EARNER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UltraStatCard
            icon={<DollarSign className="w-10 h-10" />}
            title="Total Earnings"
            value={`KES ${animatedEarnings.toLocaleString()}`}
            gradient="from-green-400 via-emerald-500 to-teal-600"
            delay="0s"
          />
          <UltraStatCard
            icon={<Users className="w-10 h-10" />}
            title="Team Power"
            value={`${totalTeam} Warriors`}
            gradient="from-blue-400 via-cyan-500 to-sky-600"
            delay="0.1s"
          />
          <UltraStatCard
            icon={<TrendingUp className="w-10 h-10" />}
            title="Growth Rate"
            value="+127.5%"
            gradient="from-purple-400 via-pink-500 to-rose-600"
            delay="0.2s"
          />
          <UltraStatCard
            icon={<Target className="w-10 h-10" />}
            title="Success Score"
            value="98.7%"
            gradient="from-orange-400 via-red-500 to-pink-600"
            delay="0.3s"
          />
        </div>

        {/* 3D Earnings Display */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl p-8 border-4 border-purple-500/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <WalletCard3D
                title="Task Wallet"
                amount={userProfile.task_balance}
                icon={<Gift className="w-8 h-8" />}
                color="from-green-400 to-emerald-600"
              />
              <WalletCard3D
                title="Referral Wallet"
                amount={userProfile.referral_balance}
                icon={<Users className="w-8 h-8" />}
                color="from-blue-400 to-cyan-600"
              />
              <WalletCard3D
                title="Total Balance"
                amount={userProfile.balance}
                icon={<Gem className="w-8 h-8" />}
                color="from-purple-400 to-pink-600"
              />
            </div>
          </div>
        </div>

        {/* 3D Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings 3D Chart */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 rounded-3xl shadow-2xl p-6 border-4 border-orange-500/50 transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-orange-400 animate-bounce" />
                  <span>Earnings Explosion</span>
                </h3>
                <Rocket className="w-8 h-8 text-orange-400 animate-pulse" />
              </div>
              <Chart3D type="earnings" />
            </div>
          </div>

          {/* Team 3D Chart */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl shadow-2xl p-6 border-4 border-blue-500/50 transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center space-x-2">
                  <Users className="w-6 h-6 text-blue-400 animate-bounce" />
                  <span>Team Empire</span>
                </h3>
                <Crown className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <Chart3D type="team" data={[
                { label: 'Level 1', value: userProfile.level1_count, color: 'from-green-400 to-emerald-600' },
                { label: 'Level 2', value: userProfile.level2_count, color: 'from-blue-400 to-cyan-600' },
                { label: 'Level 3', value: userProfile.level3_count, color: 'from-purple-400 to-pink-600' }
              ]} />
            </div>
          </div>
        </div>

        {/* Quick Actions with 3D Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl p-8 border-4 border-purple-500/50">
            <h3 className="text-3xl font-black text-white mb-6 flex items-center space-x-3">
              <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />
              <span>Power Actions</span>
              <Sparkles className="w-6 h-6 text-pink-400 animate-spin-slow" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Action3DButton
                icon={<Gift className="w-8 h-8" />}
                label="Daily Task"
                gradient="from-green-400 via-emerald-500 to-teal-600"
                onClick={() => onNavigate('Daily Task')}
              />
              <Action3DButton
                icon={<Users className="w-8 h-8" />}
                label="My Team"
                gradient="from-blue-400 via-cyan-500 to-sky-600"
                onClick={() => onNavigate('My Team')}
              />
              <Action3DButton
                icon={<Rocket className="w-8 h-8" />}
                label="Invite"
                gradient="from-purple-400 via-pink-500 to-rose-600"
                onClick={() => onNavigate('Invite Friends')}
              />
              <Action3DButton
                icon={<DollarSign className="w-8 h-8" />}
                label="Cash Out"
                gradient="from-orange-400 via-red-500 to-pink-600"
                onClick={() => onNavigate('Cash Out')}
              />
            </div>
          </div>
        </div>

        {/* Achievements Showcase */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900 rounded-3xl shadow-2xl p-8 border-4 border-yellow-500/50">
            <h3 className="text-3xl font-black text-white mb-6 flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
              <span>Hall of Fame</span>
              <Star className="w-6 h-6 text-yellow-400 animate-spin-slow" />
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {['🎯', '👑', '💎', '🚀', '⭐', '🔥'].map((emoji, i) => (
                <Achievement3D key={i} emoji={emoji} unlocked={i < 3} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float { animation: float linear infinite; }
        .animate-gradient { 
          background: linear-gradient(90deg, #fff, #ffd700, #fff);
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .animate-spin-slow { animation: spin 3s linear infinite; }
      `}</style>
    </div>
  );
};

const UltraStatCard = ({ icon, title, value, gradient, delay }: any) => (
  <div className="relative group" style={{ animationDelay: delay }}>
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse`}></div>
    <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl shadow-2xl p-6 transform hover:scale-110 hover:rotate-3 transition-all duration-500 border-4 border-white/30`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl animate-bounce">
          {icon}
        </div>
        <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
      </div>
      <p className="text-white/80 font-bold text-sm mb-2">{title}</p>
      <p className="text-white font-black text-3xl drop-shadow-2xl">{value}</p>
      <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/50 rounded-full animate-pulse" style={{ width: '75%' }}></div>
      </div>
    </div>
  </div>
);

const WalletCard3D = ({ title, amount, icon, color }: any) => (
  <div className="relative group">
    <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}></div>
    <div className={`relative bg-gradient-to-br ${color} rounded-2xl shadow-2xl p-6 transform hover:scale-105 hover:-rotate-2 transition-all duration-500 border-4 border-white/30`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg animate-pulse">
          {icon}
        </div>
        <Star className="w-5 h-5 text-white animate-spin-slow" />
      </div>
      <p className="text-white/80 font-bold text-sm mb-2">{title}</p>
      <p className="text-white font-black text-2xl">KES {amount.toLocaleString()}</p>
    </div>
  </div>
);

const Chart3D = ({ type, data }: any) => {
  if (type === 'earnings') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [100, 250, 180, 320, 280, 400, 350];
    const maxValue = Math.max(...values);
    
    return (
      <div className="h-64 flex items-end justify-between space-x-2">
        {days.map((day, i) => {
          const height = (values[i] / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center space-y-2">
              <div className="relative w-full" style={{ height: '200px' }}>
                <div className="absolute bottom-0 w-full flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-300 rounded-t-xl shadow-2xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 animate-pulse"></div>
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/50 animate-pulse"></div>
                  </div>
                  <div className="mt-2 px-2 py-1 bg-orange-500/80 backdrop-blur-sm rounded-lg">
                    <p className="text-white font-bold text-xs">{values[i]}</p>
                  </div>
                </div>
              </div>
              <p className="text-white font-bold text-sm">{day}</p>
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {data.map((item: any, i: number) => {
        const total = data.reduce((sum: number, d: any) => sum + d.value, 0);
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        
        return (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{item.label}</span>
              <span className="text-white font-black text-lg">{item.value}</span>
            </div>
            <div className="relative h-8 bg-slate-800/50 rounded-full overflow-hidden border-2 border-white/20">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${item.color} rounded-full shadow-lg transform hover:scale-105 transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Action3DButton = ({ icon, label, gradient, onClick }: any) => (
  <div className="relative group">
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity`}></div>
    <button
      onClick={onClick}
      className={`relative w-full bg-gradient-to-br ${gradient} rounded-2xl shadow-2xl p-6 transform hover:scale-110 hover:rotate-3 transition-all duration-500 border-4 border-white/30`}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl animate-bounce">
          {icon}
        </div>
        <span className="text-white font-black text-lg">{label}</span>
      </div>
    </button>
  </div>
);

const Achievement3D = ({ emoji, unlocked }: any) => (
  <div className="relative group">
    <div className={`absolute inset-0 ${unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-slate-700'} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}></div>
    <div className={`relative ${unlocked ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600' : 'bg-slate-800'} rounded-2xl shadow-2xl p-4 transform hover:scale-110 hover:rotate-12 transition-all duration-500 border-4 ${unlocked ? 'border-yellow-300' : 'border-slate-600'}`}>
      <div className="text-4xl animate-bounce">{emoji}</div>
      {unlocked && <Star className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin-slow" />}
    </div>
  </div>
);
