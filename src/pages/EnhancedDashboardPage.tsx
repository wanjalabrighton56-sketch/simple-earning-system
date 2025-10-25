import { useState } from 'react';
import { UserProfile } from '../types';
import { WalletDisplay } from '../components/WalletDisplay';
import { 
  TrendingUp, Users, DollarSign, Target, Award, Calendar,
  BarChart3, PieChart, LineChart, Activity, Zap, Star,
  Trophy, Gift, Clock, CheckCircle
} from 'lucide-react';

interface EnhancedDashboardPageProps {
  userProfile: UserProfile;
  onNavigate: (page: string) => void;
}

export const EnhancedDashboardPage = ({ userProfile, onNavigate }: EnhancedDashboardPageProps) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  
  // Mock data for charts (in production, fetch from API)
  const earningsData = [
    { day: 'Mon', task: 100, referral: 150 },
    { day: 'Tue', task: 100, referral: 200 },
    { day: 'Wed', task: 100, referral: 100 },
    { day: 'Thu', task: 100, referral: 300 },
    { day: 'Fri', task: 100, referral: 250 },
    { day: 'Sat', task: 0, referral: 400 },
    { day: 'Sun', task: 0, referral: 350 },
  ];

  const totalTeam = userProfile.level1_count + userProfile.level2_count + userProfile.level3_count;
  const weeklyEarnings = earningsData.reduce((sum, day) => sum + day.task + day.referral, 0);
  const avgDailyEarnings = Math.round(weeklyEarnings / 7);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {userProfile.username}! 🎉
            </h1>
            <p className="text-green-100 text-lg">
              You're doing amazing! Keep up the great work.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-semibold">Your Rank</p>
              <p className="text-3xl font-bold">#{Math.floor(Math.random() * 100) + 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Total Earnings"
          value={`KES ${userProfile.total_earnings.toLocaleString()}`}
          change="+12.5%"
          positive={true}
          color="green"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Team Size"
          value={totalTeam.toString()}
          change="+5 this week"
          positive={true}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Weekly Earnings"
          value={`KES ${weeklyEarnings.toLocaleString()}`}
          change="+8.3%"
          positive={true}
          color="purple"
        />
        <StatCard
          icon={<Target className="w-8 h-8" />}
          title="Daily Average"
          value={`KES ${avgDailyEarnings}`}
          change="On track"
          positive={true}
          color="orange"
        />
      </div>

      {/* Wallet Display */}
      <WalletDisplay
        taskBalance={userProfile.task_balance}
        referralBalance={userProfile.referral_balance}
        totalBalance={userProfile.balance}
      />

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-md w-fit">
        {(['day', 'week', 'month'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              timeRange === range
                ? 'bg-green-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Earnings Trend</h3>
            <LineChart className="w-6 h-6 text-green-600" />
          </div>
          <div className="h-64">
            <SimpleLineChart data={earningsData} />
          </div>
        </div>

        {/* Wallet Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Wallet Distribution</h3>
            <PieChart className="w-6 h-6 text-blue-600" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <SimplePieChart
              data={[
                { label: 'Task Wallet', value: userProfile.task_balance, color: 'bg-green-500' },
                { label: 'Referral Wallet', value: userProfile.referral_balance, color: 'bg-blue-500' },
              ]}
            />
          </div>
        </div>

        {/* Team Growth */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Team Structure</h3>
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-4">
            <TeamLevelBar
              level="Level 1 (Direct)"
              count={userProfile.level1_count}
              total={totalTeam}
              color="bg-green-500"
            />
            <TeamLevelBar
              level="Level 2"
              count={userProfile.level2_count}
              total={totalTeam}
              color="bg-blue-500"
            />
            <TeamLevelBar
              level="Level 3"
              count={userProfile.level3_count}
              total={totalTeam}
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-3">
            <ActivityItem
              icon={<CheckCircle className="w-5 h-5 text-green-600" />}
              text="Daily task completed"
              time="2 hours ago"
            />
            <ActivityItem
              icon={<Users className="w-5 h-5 text-blue-600" />}
              text="New team member joined"
              time="5 hours ago"
            />
            <ActivityItem
              icon={<DollarSign className="w-5 h-5 text-green-600" />}
              text="Referral commission earned"
              time="1 day ago"
            />
            <ActivityItem
              icon={<Award className="w-5 h-5 text-yellow-600" />}
              text="Achievement unlocked"
              time="2 days ago"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={<Calendar className="w-6 h-6" />}
            label="Daily Task"
            onClick={() => onNavigate('Daily Task')}
            color="green"
          />
          <QuickActionButton
            icon={<Users className="w-6 h-6" />}
            label="My Team"
            onClick={() => onNavigate('My Team')}
            color="blue"
          />
          <QuickActionButton
            icon={<Gift className="w-6 h-6" />}
            label="Invite Friends"
            onClick={() => onNavigate('Invite Friends')}
            color="purple"
          />
          <QuickActionButton
            icon={<DollarSign className="w-6 h-6" />}
            label="Cash Out"
            onClick={() => onNavigate('Cash Out')}
            color="orange"
          />
        </div>
      </div>

      {/* Achievements & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-yellow-200">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-8 h-8 text-yellow-600" />
            <h3 className="text-xl font-bold text-slate-900">Achievements</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AchievementBadge icon="🎯" label="First Task" unlocked={true} />
            <AchievementBadge icon="👥" label="Team Builder" unlocked={true} />
            <AchievementBadge icon="💰" label="First Earning" unlocked={true} />
            <AchievementBadge icon="🚀" label="Fast Starter" unlocked={false} />
            <AchievementBadge icon="⭐" label="Top Performer" unlocked={false} />
            <AchievementBadge icon="🏆" label="Champion" unlocked={false} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">Goals Progress</h3>
          </div>
          <div className="space-y-4">
            <GoalProgress label="Weekly Earnings Goal" current={weeklyEarnings} target={5000} />
            <GoalProgress label="Team Growth Goal" current={totalTeam} target={50} />
            <GoalProgress label="Tasks Completed" current={15} target={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, title, value, change, positive, color }: any) => {
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
      <p className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
};

const SimpleLineChart = ({ data }: any) => {
  const maxValue = Math.max(...data.map((d: any) => d.task + d.referral));
  
  return (
    <div className="h-full flex items-end justify-between space-x-2">
      {data.map((day: any, i: number) => {
        const total = day.task + day.referral;
        const height = (total / maxValue) * 100;
        
        return (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col justify-end h-48">
              <div
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-2 font-semibold">{day.day}</p>
          </div>
        );
      })}
    </div>
  );
};

const SimplePieChart = ({ data }: any) => {
  const total = data.reduce((sum: number, item: any) => sum + item.value, 0);
  
  return (
    <div className="space-y-4 w-full">
      {data.map((item: any, i: number) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              <span className="text-sm font-bold text-slate-900">
                KES {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4">
              <div
                className={`${item.color} h-4 rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TeamLevelBar = ({ level, count, total, color }: any) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">{level}</span>
        <span className="text-sm font-bold text-slate-900">{count} members</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, text, time }: any) => (
  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-900">{text}</p>
      <p className="text-xs text-slate-500">{time}</p>
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, onClick, color }: any) => {
  const colorClasses = {
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105`}
    >
      {icon}
      <span className="text-sm font-bold mt-2">{label}</span>
    </button>
  );
};

const AchievementBadge = ({ icon, label, unlocked }: any) => (
  <div className={`flex flex-col items-center p-4 rounded-lg border-2 ${
    unlocked ? 'bg-white border-yellow-400' : 'bg-slate-100 border-slate-300 opacity-50'
  }`}>
    <span className="text-3xl mb-2">{icon}</span>
    <span className="text-xs font-semibold text-center">{label}</span>
  </div>
);

const GoalProgress = ({ label, current, target }: any) => {
  const percentage = (current / target) * 100;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">
          {current} / {target}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">{percentage.toFixed(0)}% complete</p>
    </div>
  );
};
