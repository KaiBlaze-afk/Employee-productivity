import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  userInfoState,
  tasksAssignedToUserState,
  allTasksState,
  employeesState,
  loadingState,
  messageState,
  showAssignTaskState,
  graphViewState,
  tasksAssignedByUserState,
  EmployeeViewState,
} from "./store/taskList";
import { useNavigate } from "react-router-dom";
import AssignTask from "./components/AssignTask";
import AdminTaskView from "./components/AdminTaskView";
import TasksList from "./components/TasksList";
import LoadingScreen from "./components/LoadingScreen";
import LoginPrompt from "./components/LoginPrompt";
import ProfileCard from "./components/ProfileCard";
import AdminDashboardGraphs from "./components/AdminDashboardGraphs";
import EmployeeList from "./components/EmployeeList";

const API_BASE_URL = "http://localhost:3001";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [tasksAssignedByUser] = useRecoilState(tasksAssignedByUserState);
  const [tasksAssignedToUser, setTasksAssignedToUser] = useRecoilState(
    tasksAssignedToUserState
  );
  const [allTasks, setAllTasks] = useRecoilState(allTasksState);
  const [employees, setEmployees] = useRecoilState(employeesState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [message, setMessage] = useRecoilState(messageState);
  const [showAssignTask, setShowAssignTask] =
    useRecoilState(showAssignTaskState);
  const [graphView, setGraphView] = useRecoilState(graphViewState);
  const [employeeView, setEmployeeView] = useRecoilState(EmployeeViewState)

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUserInfo(data.userInfo);
        setAllTasks(data.tasks);
      } else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      setMessage({ text: "Failed to fetch dashboard data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(
          data.employees.filter((employee) => employee.role !== "admin")
        );
      }
    } catch (error) {
      console.error("Error fetching employees", error);
      setMessage({ text: "Failed to fetch employees", type: "error" });
    }
  };

  const handleMarkAsDone = async (taskId) => {
    console.log(taskId);
    const token = localStorage.getItem("accessToken");
    try {
      const task = tasksAssignedByUser.find((t) => t._id === taskId);
      console.log(tasksAssignedByUser);
      if (!task) throw new Error("Task not found");

      const currentTime = new Date();
      const deadline = new Date(task.deadline);
      const newStatus = currentTime > deadline ? "Late Submit" : "Done";

      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ text: `Task marked as ${newStatus}!`, type: "success" });
        setTasksAssignedToUser((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        setMessage({
          text: data.message || "Failed to update task",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error marking task as done", error);
      setMessage({ text: "Failed to mark task as done", type: "error" });
    }
  };

  const removeTask = async (taskId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ text: "Task removed successfully!", type: "success" });
        fetchDashboardData();
      } else {
        setMessage({
          text: data.message || "Failed to remove task",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error removing task", error);
      setMessage({ text: "Failed to remove task", type: "error" });
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(
        () => setMessage({ text: "", type: "" }),
        3000
      );
      return () => clearTimeout(timeout);
    }
  }, [message]);

  if (loading) return <LoadingScreen />;
  if (!userInfo) return <LoginPrompt />;

  console.log(employees)
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Feedback Message */}
      {message.text && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-5">
        <div className="col-span-1 bg-white rounded-lg">
          <ProfileCard
            email={userInfo.email}
            name={userInfo.username}
            department={userInfo.department}
            semester={userInfo.semester}
            subjects={userInfo.subjects}
            description={userInfo.description}
            role={userInfo.role}
            tasksAssignedCount={tasksAssignedByUser.length}
            tasksFinishedCount={tasksAssignedToUser.length}
            setGraphView={setGraphView}
            graphView={graphView}
            setEmployeeView={setEmployeeView}
            employeeView={employeeView}
          />
        </div>

        <div className="col-span-4 bg-white ">
          {userInfo.role === "admin" ? (
            <>
              {graphView && !employeeView && <AdminDashboardGraphs allTasks={allTasks} />}
              {!graphView && !employeeView && (
                <AdminTaskView
                  allTasks={allTasks}
                  adminEmail={userInfo.email}
                  removeTask={removeTask}
                />
              )}
              {!graphView && employeeView && <EmployeeList employees={employees}/>}
            </>
          ) : (
            <>
              <TasksList
                removeTask={removeTask}
                handleMarkAsDone={handleMarkAsDone}
                userInfo={userInfo}
              />
            </>
          )}
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        onClick={() => setShowAssignTask((prev) => !prev)}
      >
        +
      </button>

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform ${
          showAssignTask ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-40 w-1/3`}
      >
        <AssignTask
          userInfo={userInfo}
          employees={employees}
          fetchDashboardData={fetchDashboardData}
        />
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setShowAssignTask(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
