/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  allTasksState,
  tasksAssignedByUserState,
  tasksAssignedToUserState,
} from "../store/taskList";

const TasksList = ({ userInfo, removeTask, handleMarkAsDone }) => {
  const [taskList, setTaskList] = useRecoilState(allTasksState);
  const [filteredAssignedToMe, setFilteredAssignedToMe] = useRecoilState(
    tasksAssignedByUserState
  );
  const [filteredAssignedByMe, setFilteredAssignedByMe] = useRecoilState(
    tasksAssignedToUserState
  );

  useEffect(() => {
    if (userInfo) {
      // Using filter instead of forEach
      const assignedToMe = taskList.filter(
        (task) => task.assignedto === userInfo?.email
      );
      const assignedByMe = taskList.filter(
        (task) => task.assignedby === userInfo?.email
      );

      // Set the filtered task lists
      setFilteredAssignedToMe(assignedToMe);
      setFilteredAssignedByMe(assignedByMe);
    }
  }, [taskList, userInfo]);

  const markAsDone = async (task) => {
    try {
      const currentTime = new Date();
      const deadlineTime = new Date(task.deadline);

      // Determine the new status
      const newStatus = currentTime > deadlineTime ? "Delayed" : "Done";

      // Call the provided `handleMarkAsDone` function
      await handleMarkAsDone(task._id);

      // Update the task's status in the global state
      setTaskList((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, status: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const handleRemoveTask = (taskId) => {
    // Call the provided `removeTask` function
    removeTask(taskId);

    // Remove the task from the global state
    setTaskList((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  if (!taskList) return;

  return (
    <div className="bg-white h-[100vh] rounded-lg pt-3 px-6 overflow-hidden">
      <h3 className="text-2xl font-thin text-gray-800">Task Assigned to Me</h3>

      {/* Tasks Assigned to Me */}
      <div className="mt-2">
        <div className="overflow-x-auto max-h-80 rounded-lg mt-2">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden table-auto">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Assigned By</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Deadline</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignedToMe.length > 0 ? (
                filteredAssignedToMe.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-200 transition-all duration-300`}
                  >
                    <td className="px-6 py-4">{task.taskdata}</td>
                    <td className="px-6 py-4">{task.assignedby}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.status === "Done"
                            ? "bg-green-500 text-white"
                            : task.status === "Delayed"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Show only date without time */}
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* Mark as Done Button */}
                      {task.status !== "Done" &&
                        task.status !== "Delayed" && (
                          <button
                            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300"
                            onClick={() => markAsDone(task)}
                          >
                            Mark as Done
                          </button>
                        )}

                      {/* Delete Button */}
                      {task.assignedby === userInfo.email && (
                        <button
                          className="mt-2 text-red-600 hover:text-red-800 transition-all duration-300"
                          onClick={() => handleRemoveTask(task._id)}
                        >
                          Remove Task
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-600"
                  >
                    No tasks assigned to me.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks Assigned by Me */}
      <div className="mt-4">
        <h4 className="text-2xl font-thin text-gray-800">
          Task Assigned by Me
        </h4>
        <div className="overflow-x-auto max-h-80 rounded-lg mt-2">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden table-auto">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Assigned To</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Deadline</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignedByMe.length > 0 ? (
                filteredAssignedByMe.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-200 transition-all duration-300`}
                  >
                    <td className="px-6 py-4">{task.taskdata}</td>
                    <td className="px-6 py-4">{task.assignedto}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.status === "Done"
                            ? "bg-green-500 text-white"
                            : task.status === "Delayed"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Show only date without time */}
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* Delete Button */}
                      {task.assignedby === userInfo.email && (
                        <button
                          className="mt-2 text-red-600 hover:text-red-800 transition-all duration-300"
                          onClick={() => handleRemoveTask(task._id)}
                        >
                          Remove Task
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-600"
                  >
                    No tasks assigned by me.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TasksList;
