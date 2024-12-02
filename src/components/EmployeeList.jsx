/* eslint-disable react/prop-types */
import EmployeeCard from './EmployeeCard';

const EmployeeList = ({ employees }) => {
  console.log(employees);

  return (
    <div className="max-h-screen overflow-y-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-200 p-6">
      {/* Container for the employee cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through the array of employees and render an EmployeeCard for each */}
        {employees.map((employee, index) => {
          // Manually assigning values to match the structure expected by the EmployeeCard
          const imageUrl = `https://employee-productivity.glitch.me/uploads/${employee.email.replace(
            /[^a-zA-Z0-9]/g,
            ""
          )}.jpg`;
          const employeeData = {
            name: employee.username || "N/A",
            role: employee.role || "User",
            department: employee.department || "No department",
            semesters: employee.semester || [],
            subjects: employee.subjects || [],
            description: employee.description || "No description provided",
            email: employee.email || "No email provided",
            image: imageUrl || "https://via.placeholder.com/150", // Placeholder if no image is provided
          };

          return (
            <EmployeeCard key={index} employee={employeeData} />
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeList;
