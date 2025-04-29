import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api/queries/verifyEmail';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function verifyToken(token: string) {
    try {
      await verifyEmail({ token: token || '' });
      toast.success('E-mail address verified successfully');
      setEmailVerified(true);
    } catch (error) {
      console.error('Failed to verify email password', error);
      setError(true);
    }
  }

  verifyToken(token || '');

  return (
    <div className="flex justify-between min-h-screen bg-gray-100">
      <div className="flex flex-col items-center w-full md:w-1/2 mt-25">
        <div className="w-full max-w-md">
          <div className="rounded-xl border py-7 px-12 bg-white shadow-lg">
            {emailVerified ? (
              <div className="flex flex-col gap-5">
                <p className="text-lg text-gray-700 font-semibold">E-mail address confirmed.</p>
                <button
                  className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-2xl font-medium cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  Back to login
                </button>
              </div>
            ) : (
              <>
                {error ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-lg text-gray-700 font-semibold">Link expired.</p>
                    <p className="text-lg text-gray-700 font-semibold">Contact with system administrator.</p>
                  </div>
                ) : (
                  <p className="text-lg text-gray-700 font-semibold">Verifying e-mail address...</p>
                )}
              </>
            )}
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
