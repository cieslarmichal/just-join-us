import RegisterForm from '../../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-between min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 mt-[-50px] md:mt-[-100px]">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-medium mt-18 mb-8 text-center">Sign up</h2>
          <div className="rounded-xl border py-9 px-16 bg-white shadow-lg">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="https://static.independent.co.uk/s3fs-public/thumbnails/image/2019/04/23/11/gettyimages-1068413764.jpg"
          alt="Encouraging"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
