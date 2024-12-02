import { useNavigate } from "react-router-dom";

const LoginPrompt = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen text-xl text-gray-600">
      Please log in to view the dashboard.
      <button
        onClick={handleLogout}
        className="px-8 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPrompt;
