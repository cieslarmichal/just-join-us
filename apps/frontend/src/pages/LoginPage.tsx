import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ResetPasswordForm from '../components/ResetPasswordForm';

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset-password'>(
    tab === 'register' ? 'register' : tab === 'reset-password' ? 'reset-password' : 'login',
  );

  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (tab === 'register') {
      setActiveTab('register');
    } else if (tab === 'reset-password') {
      setActiveTab('reset-password');
    } else {
      setActiveTab('login');
    }

    setIsRegistered(false);
  }, [tab]);

  const handleTabChange = (newTab: 'login' | 'register' | 'reset-password') => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });

    if (newTab !== 'reset-password') {
      setResetPasswordSent(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
  };

  return (
    <div className="flex justify-between min-h-screen bg-gray-100">
      <div className="flex flex-col items-center w-full md:w-1/2">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6 mt-4">
            <button
              className={`px-6 py-3 text-lg font-medium cursor-pointer ${
                activeTab === 'login' ? 'text-pink-700 border-b-2 border-pink-700' : 'text-gray-500'
              }`}
              onClick={() => handleTabChange('login')}
            >
              Sign in
            </button>
            <button
              className={`px-6 py-3 text-lg font-medium cursor-pointer ${
                activeTab === 'register' ? 'text-pink-700 border-b-2 border-pink-700' : 'text-gray-500'
              }`}
              onClick={() => handleTabChange('register')}
            >
              Sign up
            </button>
          </div>

          <div className="rounded-xl border py-7 px-12 bg-white shadow-lg">
            {activeTab === 'login' && <LoginForm />}
            {activeTab === 'register' &&
              (isRegistered ? (
                <div className="flex flex-col gap-5">
                  <p className="text-lg text-gray-700 font-semibold">We have sent you an email.</p>
                  <p className="text-lg text-gray-700 font-semibold">
                    You will find a link that will allow you to activate your account.
                  </p>
                  <button
                    className="mt-4 px-6 py-3 bg-pink-600 text-white rounded-2xl cursor-pointer font-medium"
                    onClick={() => handleTabChange('login')}
                  >
                    Go to login
                  </button>
                </div>
              ) : (
                <RegisterForm onSuccess={handleRegistrationSuccess} />
              ))}
            {activeTab === 'reset-password' &&
              (resetPasswordSent ? (
                <div className="flex flex-col gap-5">
                  <p className="text-lg text-gray-700 font-semibold">
                    If there is an account associated with this email address, you will receive an email.
                  </p>
                  <p className="text-lg text-gray-700 font-semibold">
                    You will find a link that will allow you to set a new password.
                  </p>
                  <button
                    className="mt-4 px-6 py-3 bg-pink-600 text-white rounded-2xl cursor-pointer font-medium"
                    onClick={() => handleTabChange('login')}
                  >
                    Back to login
                  </button>
                </div>
              ) : (
                <ResetPasswordForm onSuccess={() => setResetPasswordSent(true)} />
              ))}
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 h-dvh">
        <img
          src="https://images.unsplash.com/photo-1528469138590-fa12d3193392?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="office"
          className="object-cover w-full h-full"
          style={{ objectPosition: 'center 20%' }}
        />
      </div>
    </div>
  );
}
