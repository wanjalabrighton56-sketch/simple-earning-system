import { Wallet, TrendingUp } from 'lucide-react';
import { formatKES } from '../utils/format';

interface WalletDisplayProps {
  taskBalance: number;
  referralBalance: number;
  totalBalance: number;
}

export const WalletDisplay = ({ taskBalance, referralBalance, totalBalance }: WalletDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-100" />
            <h3 className="text-sm font-bold text-blue-100">Task Wallet</h3>
          </div>
        </div>
        <p className="text-3xl font-extrabold text-white">{formatKES(taskBalance)}</p>
        <p className="text-xs text-blue-100 mt-2">Earnings from daily tasks</p>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-100" />
            <h3 className="text-sm font-bold text-green-100">Team Wallet</h3>
          </div>
        </div>
        <p className="text-3xl font-extrabold text-white">{formatKES(referralBalance)}</p>
        <p className="text-xs text-green-100 mt-2">Commission from your team</p>
      </div>

      <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-amber-100" />
            <h3 className="text-sm font-bold text-amber-100">Total Available</h3>
          </div>
        </div>
        <p className="text-3xl font-extrabold text-white">{formatKES(totalBalance)}</p>
        <p className="text-xs text-amber-100 mt-2">Ready to cash out</p>
      </div>
    </div>
  );
};
