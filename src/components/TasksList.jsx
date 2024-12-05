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
    <div className="bg-white rounded-lg pt-3 px-6 overflow-hidden">
      <h3 className="text-2xl font-thin text-gray-800">Task Assigned to Me</h3>

      <div className="mt-2">
        <div className="grid gap-4 sm:table sm:max-h-80 sm:overflow-x-auto sm:rounded-lg mt-2">
          {/* Render as cards on small screens, tables on larger screens */}
          {filteredAssignedToMe.length > 0 ? (
            filteredAssignedToMe.map((task) => (
              <div
                key={task._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md sm:table-row sm:table-auto sm:p-0"
              >
                <div className="flex sm:table-cell flex-col sm:flex-row sm:items-center sm:gap-4">
                  <div className="text-lg font-medium sm:table-cell">
                    {task.taskdata}
                  </div>
                  <div className="text-gray-600 sm:table-cell">
                    Assigned By: {task.assignedby}
                  </div>
                  <div className="sm:table-cell">
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
                  </div>
                  <div className="text-gray-600 sm:table-cell">
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 sm:table-cell sm:text-center">
                    {task.status !== "Done" && task.status !== "Delayed" && (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300"
                        onClick={() => markAsDone(task)}
                      >
                        Mark as Done
                      </button>
                    )}
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
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              No tasks assigned to me.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-2xl font-thin text-gray-800">
          Task Assigned by Me
        </h4>
        <div className="grid gap-4 sm:table sm:max-h-80 sm:overflow-x-auto sm:rounded-lg mt-2">
          {filteredAssignedByMe.length > 0 ? (
            filteredAssignedByMe.map((task) => (
              <div
                key={task._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md sm:table-row sm:table-auto sm:p-0"
              >
                <div className="flex sm:table-cell flex-col sm:flex-row sm:items-center sm:gap-4">
                  <div className="text-lg font-medium sm:table-cell">
                    {task.taskdata}
                  </div>
                  <div className="text-gray-600 sm:table-cell">
                    Assigned To: {task.assignedto}
                  </div>
                  <div className="sm:table-cell">
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
                  </div>
                  <div className="text-gray-600 sm:table-cell">
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 sm:table-cell sm:text-center">
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
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              No tasks assigned by me.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksList;
