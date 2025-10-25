import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { UserProfile } from './types';
import { RegistrationPage } from './pages/RegistrationPage';
import { PaymentPage } from './pages/PaymentPage';
import { DashboardPage } from './pages/DashboardPage';
import { DailyTaskPage } from './pages/DailyTaskPage';
import { MyTeamPage } from './pages/MyTeamPage';
import { CashOutForm } from './components/CashOutForm';
import {
  LayoutDashboard,
  FileText,
  Users,
  Share2,
  DollarSign,
  History,
  LogOut,
  Menu,
  X
} from 'lucide-react';

type AppState = 'loading' | 'registration' | 'payment' | 'dashboard';
type Page = 'Dashboard' | 'Daily Task' | 'My Team' | 'Invite Friends' | 'Cash Out' | 'History';

const App = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Guaranteed fallback - if nothing happens in 5 seconds, go to registration
    const fallbackTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth check timeout - redirecting to registration');
        setAppState('registration');
      }
    }, 5000);

    // Check auth status
    checkAuthStatus()
      .then(() => {
        if (isMounted) clearTimeout(fallbackTimeout);
      })
      .catch((err) => {
        console.error('Auth check error:', err);
        if (isMounted) {
          clearTimeout(fallbackTimeout);
          setAppState('registration');
        }
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      clearTimeout(fallbackTimeout);
      
      if (session?.user) {
        setUserId(session.user.id);
        await loadUserProfile(session.user.id);
      } else {
        setAppState('registration');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Starting auth check...');
      
      // First try to get session without timeout
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        setAppState('registration');
        return;
      }

      if (!session?.user) {
        console.log('No active session found, redirecting to registration');
        setAppState('registration');
        return;
      }

      console.log('Valid session found, loading user profile for:', session.user.id);
      setUserId(session.user.id);
      await loadUserProfile(session.user.id);
    } catch (error) {
      console.error('Auth check failed:', error);
      // On any error, go to registration
      setAppState('registration');
    }
  };

  const loadUserProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error || !data) {
      setAppState('registration');
      return;
    }

    setUserId(uid);
    setUserProfile(data as UserProfile);

    if (!data.is_activated) {
      setAppState('payment');
    } else {
      setAppState('dashboard');

      const channel = supabase
        .channel(`user_profile:${uid}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_profiles',
            filter: `id=eq.${uid}`
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              setUserProfile(payload.new as UserProfile);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  };

  const handleRegistrationComplete = async (newUserId: string) => {
    setUserId(newUserId);
    await loadUserProfile(newUserId);
  };

  const handlePaymentComplete = async () => {
    if (userId) {
      await loadUserProfile(userId);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAppState('registration');
    setUserProfile(null);
    setUserId(null);
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (appState === 'registration') {
    return <RegistrationPage onRegistrationComplete={handleRegistrationComplete} />;
  }

  if (appState === 'payment' && userId) {
    return <PaymentPage userId={userId} onPaymentComplete={handlePaymentComplete} />;
  }

  if (appState === 'dashboard' && userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Earning System</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                <p className="text-sm font-semibold text-slate-300">{userProfile.username}</p>
                <p className="text-xs text-slate-400 mt-1">{userProfile.phone_number}</p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <NavItem
                icon={<LayoutDashboard />}
                label="Dashboard"
                active={currentPage === 'Dashboard'}
                onClick={() => {
                  setCurrentPage('Dashboard');
                  setSidebarOpen(false);
                }}
              />
              <NavItem
                icon={<FileText />}
                label="Daily Task"
                active={currentPage === 'Daily Task'}
                onClick={() => {
                  setCurrentPage('Daily Task');
                  setSidebarOpen(false);
                }}
              />
              <NavItem
                icon={<Users />}
                label="My Team"
                active={currentPage === 'My Team'}
                onClick={() => {
                  setCurrentPage('My Team');
                  setSidebarOpen(false);
                }}
              />
              <NavItem
                icon={<Share2 />}
                label="Invite Friends"
                active={currentPage === 'Invite Friends'}
                onClick={() => {
                  setCurrentPage('Invite Friends');
                  setSidebarOpen(false);
                }}
              />
              <NavItem
                icon={<DollarSign />}
                label="Cash Out"
                active={currentPage === 'Cash Out'}
                onClick={() => {
                  setCurrentPage('Cash Out');
                  setSidebarOpen(false);
                }}
              />
              <NavItem
                icon={<History />}
                label="History"
                active={currentPage === 'History'}
                onClick={() => {
                  setCurrentPage('History');
                  setSidebarOpen(false);
                }}
              />
            </nav>

            <div className="p-4 border-t border-slate-700">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-700 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <PageContent
              page={currentPage}
              userProfile={userProfile}
              onNavigate={setCurrentPage}
            />
          </div>
        </main>
      </div>
    );
  }

  return null;
};

const NavItem = ({
  icon,
  label,
  active,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
      active
        ? 'bg-green-600 text-white shadow-lg'
        : 'text-slate-300 hover:bg-slate-800'
    }`}
  >
    <div className="w-5 h-5">{icon}</div>
    <span className="font-semibold">{label}</span>
  </button>
);

const PageContent = ({
  page,
  userProfile,
  onNavigate
}: {
  page: Page;
  userProfile: UserProfile;
  onNavigate: (page: Page) => void;
}) => {
  switch (page) {
    case 'Dashboard':
      return <DashboardPage userProfile={userProfile} onNavigate={onNavigate} />;
    case 'Daily Task':
      return <DailyTaskPage userId={userProfile.id!} />;
    case 'My Team':
      return <MyTeamPage userProfile={userProfile} userId={userProfile.id!} />;
    case 'Invite Friends':
      return <MyTeamPage userProfile={userProfile} userId={userProfile.id!} />;
    case 'Cash Out':
      return <CashOutForm userProfile={userProfile} />;
    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{page}</h2>
          <p className="text-slate-600">This page is under construction</p>
        </div>
      );
  }
};

export default App;
