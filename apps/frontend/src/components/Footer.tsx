import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-14 px-4 sm:px-6 lg:px-10">
      <div className="flex">
        <Link
          to="/"
          className="font-bold text-2xl pl-40"
        >
          justjoin.us
        </Link>

        <div className="flex flex-col sm:flex-row justify-between w-full px-40">
          <div className="text-sm">
            <h3 className="text-xl font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/job-offers"
                  className="hover:underline text-gray-400"
                >
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="hover:underline text-gray-400"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:underline text-gray-400"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:underline text-gray-400"
                >
                  Aboout Us
                </Link>
              </li>
              <li>
                <Link
                  to="/career"
                  className="hover:underline text-gray-400"
                >
                  Career
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="text-xl font-semibold mb-4 ">Follow us on social media</h3>
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com"
                className="bg-gray-800 rounded-full p-2 hover:bg-gray-700"
              >
                <FaFacebookF className="text-gray-400 size-6" />
              </a>
              <a
                href="https://instagram.com"
                className="bg-gray-800 rounded-full p-2 hover:bg-gray-700"
              >
                <FaInstagram className="text-gray-400 size-6" />
              </a>
              <a
                href="https://youtube.com"
                className="bg-gray-800 rounded-full p-2 hover:bg-gray-700"
              >
                <FaYoutube className="text-gray-400 size-6" />
              </a>
              <a
                href="https://tiktok.com"
                className="bg-gray-800 rounded-full p-2 hover:bg-gray-700"
              >
                <FaTiktok className="text-gray-400 size-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
