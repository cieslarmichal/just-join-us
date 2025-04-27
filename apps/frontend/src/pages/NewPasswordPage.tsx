import NewPasswordForm from '../components/NewPasswordForm';

export default function NewPasswordPage() {
  return (
    <div className="flex justify-between min-h-screen bg-gray-100">
      <div className="flex flex-col items-center w-full md:w-1/2 mt-25">
        <div className="w-full max-w-md">
          <div className="rounded-xl border py-7 px-12 bg-white shadow-lg">
            <NewPasswordForm />
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
