/* eslint-disable react/prop-types */
const EmployeeCard = ({ employee }) => {
  return (
    <div className="max-w-xs w-full bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Profile Image */}
      <img
        className="w-full h-56 object-cover"
        src={employee.image}
        alt={employee.name || "Employee"}
      />

      <div className="p-6">
        {/* Name and Role */}
        <div className="mb-3">
          <h2 className="text-2xl font-semibold text-gray-800">{employee.name}</h2>
          <p className="text-gray-500 text-sm">{employee.role}</p>
        </div>

        {/* Department and Semesters */}
        <div className="mb-3">
          <p className="text-gray-700 text-sm">
            <strong>Department:</strong> {employee.department}
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Semesters:</strong> {employee.semesters}
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Subjects:</strong> {employee.subjects.length > 0 ? employee.subjects.join(', ') : "No subjects listed"}
          </p>
        </div>

        {/* Subjects */}
        <div className="mb-3">
          
        </div>

        {/* Description */}
        <div className="mb-3">
          <p className="text-gray-700 text-sm">{employee.description}</p>
        </div>

        {/* Contact Information */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm">Email: {employee.email}</p>
        </div>

        {/* Email Link (Action) */}
        <div className="mt-4">
          <a
            href={`mailto:${employee.email}`}
            className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-200"
          > Email Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
