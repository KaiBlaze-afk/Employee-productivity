import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

// eslint-disable-next-line react/prop-types
const LoginPage = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [EmailError, setEmailError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
    } else if (password.length < 1) {
      setPasswordError(true);
    } else {
      axios
        .post("http://employee-productivity.glitch.me/login", { email, password })
        .then((result) => {
          if (!result.data.accessToken) {
            setError("Email or Password incorrect!");
          } else {
            localStorage.setItem("accessToken", result.data.accessToken);
            setIsAuthenticated(true);
            navigate("/dashboard");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-10 shadow-2xl rounded-3xl">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
          <p className="text-lg text-gray-600">
            Log in to continue to your dashboard.
          </p>
        </div>
        <form className="space-y-8 mt-8" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}
          {EmailError && (
            <div className="text-sm text-red-600">
              Please enter a valid email address.
            </div>
          )}
          {PasswordError && (
            <div className="text-sm text-red-600">Password cannot be empty.</div>
          )}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
          >
            Log In
          </button>
        </form>
        <div className="mt-10 text-center">
          <p className="text-base text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
