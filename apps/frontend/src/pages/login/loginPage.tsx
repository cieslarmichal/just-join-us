import LoginForm from './loginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-between min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in</h2>
          <div className="rounded-xl border p-6 bg-white shadow-lg">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="https://lavora.site/produkcja/ccdskills/wp-content/uploads/2025/02/img_3.jpg"
          alt="Encouraging"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
