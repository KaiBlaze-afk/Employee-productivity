/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

function ProfileCard({
  email,
  name,
  department,
  semester,
  subjects,
  description,
  role,
  tasksAssignedCount = 0,
  tasksFinishedCount = 0,
  setGraphView,
  graphView,
  setEmployeeView,
  employeeView,
}) {
  const navigate = useNavigate();
  const imageUrl = `http://localhost:3001/${email.replace(
    /[^a-zA-Z0-9]/g,
    ""
  )}.jpg`;

   const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className=" bg-gradient-to-br from-purple-100 via-indigo-50 to-indigo-200   flex flex-col items-center justify-center p-6  transition-all h-screen">
      <div className="flex items-center justify-center mb-4">
        <img
          src={imageUrl}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full border-4 border-indigo-600 shadow-lg object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            if (e.target.src !== "http://localhost:3001/user.png") {
              e.target.src = "http://localhost:3001/user.png";
            }
          }}
        />
      </div>

      {/* Name and Role */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-1 transition-transform duration-300 transform hover:text-indigo-600">
        {name || "Name"}
      </h2>
      <p className="text-indigo-600 text-md mb-3">{role || "Role"}</p>

      {/* Details */}
      <div className="bg-indigo-100 p-4 rounded-lg shadow-inner mb-4">
        <p className="text-gray-700 text-sm mb-1">
          <span className="font-semibold text-indigo-700">Email:</span>{" "}
          {email || "example@domain.com"}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <span className="font-semibold text-indigo-700">Department:</span>{" "}
          {department || "Department"}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <span className="font-semibold text-indigo-700">Semesters:</span>{" "}
          {semester || "Semester details"}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <span className="font-semibold text-indigo-700">Subjects:</span>{" "}
          {subjects || "Subject details"}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {description ||
          "A passionate individual dedicated to excellence in the field of education and personal development."}
      </p>

      {/* Task Counts */}
      {role === "user" && (
        <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
          <h3 className="text-md font-semibold text-indigo-700 mb-3">Tasks</h3>
          <div className="mb-3">
            <h4 className="text-indigo-600 font-medium text-sm mb-1">
              Tasks Assigned to Others:
            </h4>
            <p className="text-gray-700 text-sm">
              {tasksAssignedCount} tasks assigned
            </p>
          </div>
          <div>
            <h4 className="text-indigo-600 font-medium text-sm mb-1">
              Tasks Received by {name}:
            </h4>
            <p className="text-gray-700 text-sm">
              {tasksFinishedCount} tasks finished
            </p>
          </div>
        </div>
      )}
      {role === "admin" && (
        <>
        <div className="flex flex-col items-center gap-2 p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg w-64 mx-auto">
          <button
            className={`w-full px-8 py-3 font-semibold rounded-lg transition-all duration-300 ${
              !employeeView && !graphView
                ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                : 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
            }`}
            onClick={() => {
              setEmployeeView(false);
              setGraphView(false);
            }}
          >
            Tasks Lists
          </button>
          <button
            className={`w-full px-8 py-3 font-semibold rounded-lg transition-all duration-300 ${
              employeeView
              ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
              : 'border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
            }`}
            onClick={() => {
              setEmployeeView(true);
              setGraphView(false);
            }}
          >
            Employees
          </button>
          <button
            className={`w-full px-8 py-3 font-semibold rounded-lg transition-all duration-300 ${
              graphView
              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                : 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
            }`}
            onClick={() => {
              setEmployeeView(false);
              setGraphView(true);
            }}
          >
            Graphs
          </button>
        </div>
      </>
      
      )}
      {/* Logout Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleLogout}
          className="px-8 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
