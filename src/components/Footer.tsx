export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto pt-8 pb-4 border-t border-slate-200">
      <div className="text-center">
        <p className="text-sm text-slate-600 font-medium">
          © {currentYear} <span className="font-bold text-green-600">SmartPay</span> - Task & Referral Earning System
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Developed by <span className="font-semibold text-blue-600">Brighton's Developers Group</span> under{' '}
          <span className="font-semibold text-blue-600">Brightech Management</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          All rights reserved. Powered by innovation and excellence.
        </p>
      </div>
    </footer>
  );
};
