import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { UserProfile } from './types';
import { RegistrationPage } from './pages/RegistrationPage';
import { PaymentPage } from './pages/PaymentPage';
import { ProfessionalDashboard } from './pages/ProfessionalDashboard';
import { DailyTaskPage } from './pages/DailyTaskPage';
import { MyTeamPage } from './pages/MyTeamPage';
import { InviteFriendsPage } from './pages/InviteFriendsPage';
import { HistoryPage } from './pages/HistoryPage';
import { MarketingHubPage } from './pages/MarketingHubPage';
import { TrainingHubPage } from './pages/TrainingHubPage';
import { CashOutForm } from './components/CashOutForm';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import {
  LayoutDashboard,
  FileText,
  Users,
  Share2,
  DollarSign,
  History,
  LogOut,
  Menu,
  X,
  Megaphone,
  GraduationCap
} from 'lucide-react';

type AppState = 'loading' | 'registration' | 'payment' | 'dashboard';
type Page = 'Dashboard' | 'Daily Task' | 'My Team' | 'Invite Friends' | 'Cash Out' | 'History' | 'Marketing Hub' | 'Training Hub';

const App = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let authCheckCompleted = false;
    let subscription: any;
    
    // ULTRA-FAST fallback - 2 seconds max
    const fallbackTimeout = setTimeout(() => {
      if (isMounted && !authCheckCompleted) {
        console.warn('🚨 AUTH TIMEOUT - Redirecting to registration');
        setAppState('registration');
        authCheckCompleted = true;
      }
    }, 2000);

    // Immediate auth check
    const performAuthCheck = async () => {
      try {
        console.log('🔍 CHECKING EXISTING SESSION...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        authCheckCompleted = true;
        clearTimeout(fallbackTimeout);
        
        if (error) {
          console.error('🚨 SESSION ERROR:', error);
          throw error;
        }
        
        if (session?.user) {
          console.log('✅ EXISTING SESSION FOUND:', session.user.id);
          setUserId(session.user.id);
          await loadUserProfile(session.user.id);
        } else {
          console.log('❌ NO SESSION - Going to registration');
          setAppState('registration');
        }
      } catch (error) {
        console.error('🚨 AUTH CHECK ERROR:', error);
        if (isMounted) {
          authCheckCompleted = true;
          clearTimeout(fallbackTimeout);
          setAppState('registration');
        }
      }
    };

    // Start auth check
    performAuthCheck();

    // Setup auth listener (ONLY for sign-out events)
    const setupAuthListener = () => {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 AUTH STATE CHANGE:', event, session?.user?.id || 'NO USER');
        
        // Only handle sign-out events to avoid conflicts
        if (event === 'SIGNED_OUT') {
          console.log('👋 USER SIGNED OUT');
          setAppState('registration');
          setUserProfile(null);
          setUserId(null);
        }
        // Form submissions will handle SIGNED_IN events directly
      });
      subscription = data.subscription;
    };

    setupAuthListener();

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, []);

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
    console.log('🎉 REGISTRATION/LOGIN COMPLETE:', newUserId);
    
    // Immediately set loading state to prevent UI issues
    setAppState('loading');
    
    try {
      setUserId(newUserId);
      await loadUserProfile(newUserId);
    } catch (error) {
      console.error('🚨 PROFILE LOAD ERROR:', error);
      setAppState('registration');
    }
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
    return <LoadingScreen onSkip={() => setAppState('registration')} />;
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
                <h1 className="text-xl font-bold text-white">SmartPay</h1>
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
              <NavItem
                icon={<Megaphone />}
                label="Marketing Hub"
                active={currentPage === 'Marketing Hub'}
                onClick={() => {
                  setCurrentPage('Marketing Hub');
                  setSidebarOpen(false);
                }}
              />
              <NavItem
                icon={<GraduationCap />}
                label="Training Hub"
                active={currentPage === 'Training Hub'}
                onClick={() => {
                  setCurrentPage('Training Hub');
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
            <Footer />
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
      return <ProfessionalDashboard userProfile={userProfile} onNavigate={onNavigate} />;
    case 'Daily Task':
      return <DailyTaskPage userId={userProfile.id!} />;
    case 'My Team':
      return <MyTeamPage userProfile={userProfile} userId={userProfile.id!} />;
    case 'Invite Friends':
      return <InviteFriendsPage userProfile={userProfile} />;
    case 'Cash Out':
      return <CashOutForm userProfile={userProfile} />;
    case 'History':
      return <HistoryPage userProfile={userProfile} />;
    case 'Marketing Hub':
      return <MarketingHubPage />;
    case 'Training Hub':
      return <TrainingHubPage />;
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
