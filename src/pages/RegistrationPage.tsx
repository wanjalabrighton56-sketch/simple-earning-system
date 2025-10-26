import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

interface RegistrationPageProps {
  onRegistrationComplete: (userId: string) => void;
}

export const RegistrationPage = ({ onRegistrationComplete }: RegistrationPageProps) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {showLogin ? (
        <LoginForm 
          onLoginComplete={onRegistrationComplete}
          onSwitchToRegister={() => setShowLogin(false)}
        />
      ) : (
        <RegisterForm 
          onRegistrationComplete={onRegistrationComplete}
          onSwitchToLogin={() => setShowLogin(true)}
        />
      )}
    </div>
  );
};
