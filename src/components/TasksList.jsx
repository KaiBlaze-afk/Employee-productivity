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
      const assignedToMe = taskList.filter(
        (task) => task.assignedto === userInfo?.email
      );
      const assignedByMe = taskList.filter(
        (task) => task.assignedby === userInfo?.email
      );

      setFilteredAssignedToMe(assignedToMe);
      setFilteredAssignedByMe(assignedByMe);
    }
  }, [taskList, userInfo]);

  const markAsDone = async (task) => {
    try {
      const currentTime = new Date();
      const deadlineTime = new Date(task.deadline);
      const newStatus = currentTime > deadlineTime ? "Delayed" : "Done";

      await handleMarkAsDone(task._id);

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
    removeTask(taskId);

    setTaskList((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  if (!taskList) return;

  return (
    <div className="bg-white rounded-lg pt-3 px-6 max-h-[100vh] overflow-y-auto">
      {/* Assigned to Me */}
      <h3 className="text-2xl font-thin text-gray-800">Task Assigned to Me</h3>
      <div className="mt-2">
        {/* Mobile Card Layout */}
        <div className="block sm:hidden grid gap-4">
          {filteredAssignedToMe.length > 0 ? (
            filteredAssignedToMe.map((task) => (
              <div
                key={task._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h4 className="text-lg font-semibold">{task.taskdata}</h4>
                <p className="text-gray-600">
                  <strong>Assigned By:</strong> {task.assignedby}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong>{" "}
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
                </p>
                <p className="text-gray-600">
                  <strong>Deadline:</strong>{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  {task.status !== "Done" && task.status !== "Delayed" && (
                    <button
                      className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300"
                      onClick={() => markAsDone(task)}
                    >
                      Mark as Done
                    </button>
                  )}
                  {task.assignedby === userInfo.email && (
                    <button
                      className="ml-2 text-red-600 hover:text-red-800 transition-all duration-300"
                      onClick={() => handleRemoveTask(task._id)}
                    >
                      Remove Task
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks assigned to me.</p>
          )}
        </div>
        {/* Desktop Table Layout */}
        <div className="hidden sm:block overflow-x-auto max-h-[42vh] rounded-lg mt-2">
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
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {task.status !== "Done" && task.status !== "Delayed" && (
                        <button
                          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300"
                          onClick={() => markAsDone(task)}
                        >
                          Mark as Done
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

      {/* Task Assigned by Me */}
      <div className="mt-4">
        <h4 className="text-2xl font-thin text-gray-800">
          Task Assigned by Me
        </h4>
        <div className="block sm:hidden grid gap-4">
          {filteredAssignedByMe.length > 0 ? (
            filteredAssignedByMe.map((task) => (
              <div
                key={task._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h4 className="text-lg font-semibold">{task.taskdata}</h4>
                <p className="text-gray-600">
                  <strong>Assigned To:</strong> {task.assignedto}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong>{" "}
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
                </p>
                <p className="text-gray-600">
                  <strong>Deadline:</strong>{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  {task.assignedby === userInfo.email && (
                    <button
                      className="text-red-600 hover:text-red-800 transition-all duration-300"
                      onClick={() => handleRemoveTask(task._id)}
                    >
                      Remove Task
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No tasks assigned by me.
            </p>
          )}
        </div>
        {/* Fixed Table Layout for PC */}
        <div className="hidden sm:block overflow-x-auto max-h-[42vh] rounded-lg mt-2">
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
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {task.assignedby === userInfo.email && (
                        <button
                          className="text-red-600 hover:text-red-800 transition-all duration-300"
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
