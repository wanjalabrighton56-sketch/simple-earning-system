import { UserProfile, COMMISSION_RATES } from '../types';
import { WalletDisplay } from '../components/WalletDisplay';
import { formatKES } from '../utils/format';
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardPageProps {
  userProfile: UserProfile;
  onNavigate: (page: string) => void;
}

export const DashboardPage = ({ userProfile, onNavigate }: DashboardPageProps) => {
  const totalTeam = userProfile.level1_count + userProfile.level2_count + userProfile.level3_count;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
          Welcome back, {userProfile.username}!
        </h2>
        <p className="text-slate-600">Here's your account overview</p>
      </div>

      <WalletDisplay
        taskBalance={userProfile.task_balance}
        referralBalance={userProfile.referral_balance}
        totalBalance={userProfile.balance}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earned"
          value={formatKES(userProfile.total_earnings)}
          color="purple"
          icon={<TrendingUp />}
        />
        <StatCard
          title="Total Team"
          value={totalTeam.toString()}
          color="blue"
          icon={<Users />}
        />
        <StatCard
          title="Direct Team (L1)"
          value={userProfile.level1_count.toString()}
          color="green"
          icon={<Users />}
        />
        <StatCard
          title="Commission Rate (L1)"
          value={formatKES(COMMISSION_RATES.LEVEL_1)}
          color="amber"
          icon={<DollarSign />}
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Do Daily Task"
            description="Write a short article and earn KES 100"
            icon={<FileText className="w-8 h-8" />}
            color="blue"
            onClick={() => onNavigate('Daily Task')}
          />
          <ActionCard
            title="Invite Friends"
            description="Grow your team and earn commissions"
            icon={<Users className="w-8 h-8" />}
            color="green"
            onClick={() => onNavigate('Invite Friends')}
          />
          <ActionCard
            title="Cash Out"
            description="Withdraw money to your M-PESA"
            icon={<DollarSign className="w-8 h-8" />}
            color="amber"
            onClick={() => onNavigate('Cash Out')}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  color,
  icon
}: {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 transform hover:scale-105 transition duration-200`}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <div className={`text-${color}-500`}>{icon}</div>
    </div>
    <p className={`text-3xl font-extrabold text-${color}-600`}>{value}</p>
  </div>
);

const ActionCard = ({
  title,
  description,
  icon,
  color,
  onClick
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-xl shadow-lg p-6 border-t-4 border-${color}-500 transform hover:scale-105 transition duration-200 text-left hover:shadow-xl`}
  >
    <div className={`text-${color}-600 mb-4`}>{icon}</div>
    <h4 className="text-xl font-bold text-slate-900 mb-2">{title}</h4>
    <p className="text-sm text-slate-600">{description}</p>
  </button>
);
