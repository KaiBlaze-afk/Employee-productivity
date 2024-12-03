import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, User, Lock, Briefcase, FileText, BookOpen, Camera } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState("");
  const [description, setDescription] = useState("");
  const [role] = useState("user");
  const [image, setImage] = useState(null); // For image upload
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("subjects", subjects);
    formData.append("description", description);
    formData.append("role", role);
    if (image) formData.append("image", image, email); // Use email as the image filename

    try {
      const response = await axios.post("https://employee-productivity.glitch.me/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setSuccessMessage("Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect after 3 seconds
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-10 shadow-2xl rounded-3xl">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-lg text-gray-600">Join us and start your journey!</p>
        </div>
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}
        {passwordError && (
          <p className="text-red-500 text-center mt-4 font-medium">
            {passwordError}
          </p>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4 text-center">
            <strong>{successMessage}</strong>
          </div>
        )}
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          {/* Email and Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative">
            <label htmlFor="image" className="flex items-center text-gray-600 mt-4 cursor-pointer">
              <Camera className="h-6 w-6 mr-2 text-gray-400" />
              <span>Upload Profile Image (Optional)</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {image && (
              <p className="mt-2 text-gray-500">Selected image: {image.name}</p>
            )}
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Department and Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Subjects and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Subjects"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-12 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-4 rounded-lg shadow-xl hover:bg-green-600 transition duration-200"
            >
              Register
            </button>
          </div>

          {/* Link to Login */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
