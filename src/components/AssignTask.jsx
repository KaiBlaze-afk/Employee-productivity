/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";
import MicroPhoneButton from "./MicroPhoneButton";
import { useRecoilState } from "recoil";
import { allTasksState } from "../store/taskList";
import { isListeningState, voiceState } from "../store/voiceState";

const AssignTask = ({ userInfo, employees, fetchDashboardData }) => {
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [taskLists, setTaskList] = useRecoilState(allTasksState);
  const transcript = useRecoilState(voiceState);
  const [isListening] = useRecoilState(isListeningState);

  const resetInputField = () => {
    setNewTask("");
    setSearchQuery("");
    setDeadline("");
    setSelectedUsers([]);
  };

  useEffect(() => {
    if (!isListening && transcript.length > 0) {
      handleTranscript();
    }
  }, [isListening]);

  const handleTranscript = () => {
    try {
      const taskRegex =
        /assign the task to (.*) to (.*?)(?: with the deadline of (.*))?$/i;
      const dateRegex = /(\d{1,2})\s(\w+)(?:\s(\d{4}))?/;
      let match;

      match = transcript[0].match(taskRegex);

      if (!match) {
        setConfirmationMessage("Unable to parse transcript.");
        setTimeout(() => setConfirmationMessage(""), 3000);
        return;
      }

      const taskDescription = match[1]?.trim();
      const usersString = match[2]?.trim();
      const deadlineString = match[3]?.trim();

      const users = usersString.split(" and ").map((name) => name.trim());
      const matchedUsers = users
        .map((user) => {
          const foundEmployee = employees?.find((employee) =>
            employee.username.toLowerCase().includes(user.toLowerCase())
          );
          return foundEmployee ? foundEmployee.email : null;
        })
        .filter(Boolean);

      let formattedDate;

      if (deadlineString) {
        const dateMatch = deadlineString.match(dateRegex);

        if (dateMatch) {
          const day = parseInt(dateMatch[1], 10);
          const month = new Date(`${dateMatch[2]} 1`).getMonth(); // Converts month name to number
          const year = dateMatch[3]
            ? parseInt(dateMatch[3], 10)
            : new Date().getFullYear();

          const parsedDate = new Date(year, month, day);

          if (!isNaN(parsedDate)) {
            formattedDate = parsedDate.toISOString().split("T")[0];
          } else {
            setConfirmationMessage("Invalid deadline date provided.");
            setTimeout(() => setConfirmationMessage(""), 3000);
          }
        } else {
          setConfirmationMessage("Failed to parse the deadline date.");
          setTimeout(() => setConfirmationMessage(""), 3000);
        }
      }

      // Confirmation message about matched users
      setConfirmationMessage(
        matchedUsers.length > 0
          ? `Matched users: ${matchedUsers.join(", ")}`
          : "No matching employees found."
      );

      if (
        JSON.stringify(matchedUsers.sort()) !==
        JSON.stringify(selectedUsers.sort())
      ) {
        setSelectedUsers(matchedUsers);
      }

      setDeadline(formattedDate);
      setNewTask(taskDescription);

      setTimeout(() => setConfirmationMessage(""), 3000);
    } catch (error) {
      console.error("Error in handleTranscript:", error);
      setConfirmationMessage("An error occurred. Please try again.");
      setTimeout(() => setConfirmationMessage(""), 3000);
    }
  };

  const handleAssignTask = async () => {
    const token = localStorage.getItem("accessToken");
    const newTaskData = {
      taskdata: newTask,
      assignedby: userInfo.email,
      assignedto: selectedUsers,
      deadline,
      status: "Pending",
    };

    try {
      // Update the global Recoil state first
      setTaskList((prevTasks) => [newTaskData, ...prevTasks]);
      console.log(newTaskData);
      console.log(taskLists);
      // Send the task to the server
      const response = await fetch("https://employee-productivity.glitch.me/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTaskData),
      });
      const data = await response.json();

      if (data.success) {
        setConfirmationMessage("Task assigned successfully!");
        setTimeout(() => setConfirmationMessage(""), 3000);

        // Clear input fields after successful submission
        setNewTask("");
        setSelectedUsers([]);
        setDeadline("");

        // Optionally fetch the updated dashboard data
        fetchDashboardData();
      } else {
        setConfirmationMessage(data.message || "Failed to assign task");
        setTimeout(() => setConfirmationMessage(""), 3000);
      }
      resetInputField();
    } catch (error) {
      console.error("Error assigning task", error);
      setConfirmationMessage("Failed to assign task");
      setTimeout(() => setConfirmationMessage(""), 3000);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      employee.email !== userInfo.email
  );

  return (
    <div className="bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-200 min-h-screen max-h-screen shadow-lg p-8 max-w-2xl mx-auto transition-all ease-in-out transform">
      <h3 className="text-2xl font-thin text-gray-800 mb-2">Assign Task</h3>

      <MicroPhoneButton onTranscriptReceived={handleTranscript} />

      {confirmationMessage && (
        <div className="mb-2 p-2 text-center text-white bg-green-500 rounded-lg shadow-lg transition-transform transform">
          {confirmationMessage}
        </div>
      )}

      <textarea
        className="w-full border border-gray-300 rounded-lg shadow-sm p-4 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
        placeholder="Enter task details..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      ></textarea>

      <input
        type="date"
        className="w-full border border-gray-300 rounded-lg shadow-sm p-3 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <input
        type="text"
        placeholder="Search employees by name or email"
        className="w-full border border-gray-300 rounded-lg shadow-sm p-3 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-inner max-h-48 min-h-48 overflow-y-auto p-4 mb-3 transition-all duration-300">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div
              key={employee._id}
              className="flex items-center justify-between mb-3 p-3 bg-white shadow-sm rounded-md hover:bg-gray-50 transition-all duration-300"
            >
              <div>
                <p className="font-medium text-gray-800">{employee.username}</p>
                <p className="text-sm text-gray-600">{employee.email}</p>
              </div>
              <button
                onClick={() => {
                  const value = employee.email;
                  setSelectedUsers((prev) =>
                    prev.includes(value)
                      ? prev.filter((email) => email !== value)
                      : [...prev, value]
                  );
                }}
                className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                  selectedUsers.includes(employee.email)
                    ? "bg-blue-500 text-white scale-110"
                    : "bg-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {selectedUsers.includes(employee.email) ? (
                  <FaCheck />
                ) : (
                  <FaPlus />
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No employees found</p>
        )}
      </div>

      <button
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        onClick={handleAssignTask}
      >
        Assign Task
      </button>
    </div>
  );
};

export default AssignTask;
