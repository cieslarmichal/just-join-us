import RegisterForm from './registerForm';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-between min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 mt-[-50px] md:mt-[-100px]">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign up</h2>
          <div className="rounded-xl border p-6 bg-white shadow-lg">
            <RegisterForm />
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
