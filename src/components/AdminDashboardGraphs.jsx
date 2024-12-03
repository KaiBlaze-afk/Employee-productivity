/* eslint-disable react/prop-types */
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboardGraph = ({ allTasks }) => {
  // Helper function to calculate the difference in days
  const getDaysDifference = (date) => {
    const today = new Date();
    const deadline = new Date(date);
    const timeDifference = deadline - today;
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert from milliseconds to days
    return daysDifference;
  };

  // Categorize tasks by deadline
  const deadlines = { 'This Week': 0, 'This Month': 0, 'More Than a Month': 0 };

  allTasks.forEach((task) => {
    const daysLeft = getDaysDifference(task.deadline);

    if (daysLeft <= 7) {
      deadlines['This Week']++;
    } else if (daysLeft <= 30) {
      deadlines['This Month']++;
    } else {
      deadlines['More Than a Month']++;
    }
  });

  // Prepare the Pie chart data (Task deadlines)
  const pieData = {
    labels: ['This Week', 'This Month', 'More Than a Month'],
    datasets: [
      {
        label: 'Task Deadlines',
        data: [deadlines['This Week'], deadlines['This Month'], deadlines['More Than a Month']],
        backgroundColor: ['#1E90FF', '#FF6347', '#32CD32'], // Blue, Tomato, Lime Green
        borderWidth: 2,
      },
    ],
  };

  // Group tasks by assigned-to person and status for bar graph data
  const assignedToCounts = {};
  allTasks.forEach((task) => {
    if (!assignedToCounts[task.assignedto]) {
      assignedToCounts[task.assignedto] = { Assigned: 0, Done: 0, Delayed: 0 };
    }

    // Increase the count for the respective status
    if (task.status === 'Done') {
      assignedToCounts[task.assignedto].Done++;
    } else if (task.status === 'Delayed') {
      assignedToCounts[task.assignedto].Delayed++;
    } else {
      assignedToCounts[task.assignedto].Assigned++;
    }
  });
  
  Object.keys(assignedToCounts).forEach((assignee) => {
    const totalAssigned = allTasks.filter((task) => task.assignedto === assignee).length;
    const doneCount = assignedToCounts[assignee].Done;
    const delayedCount = assignedToCounts[assignee].Delayed;
  
    // Ensure "Assigned" reflects tasks neither done nor delayed
    assignedToCounts[assignee].Assigned = totalAssigned - doneCount - delayedCount;
  });
  

  // Prepare the Stacked Bar Graph data (Tasks by Assignee)
  const barData = {
    labels: Object.keys(assignedToCounts), // Assignees
    datasets: [
      {
        label: 'Assigned',
        data: Object.values(assignedToCounts).map((counts) => counts.Assigned),
        backgroundColor: '#FF7F50', // Coral
        stack: 'Stack 0',
      },
      {
        label: 'Done',
        data: Object.values(assignedToCounts).map((counts) => counts.Done),
        backgroundColor: '#32CD32', // Lime Green
        stack: 'Stack 0',
      },
      {
        label: 'Delayed',
        data: Object.values(assignedToCounts).map((counts) => counts.Delayed),
        backgroundColor: '#FF6347', // Tomato
        stack: 'Stack 0',
      },
    ],
  };

  // Prepare the Line Chart data (Tasks over time)
  const taskOverTimeData = allTasks.reduce((acc, task) => {
    const deadline = new Date(task.deadline).toLocaleDateString();
    if (!acc[deadline]) acc[deadline] = 0;
    acc[deadline]++;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(taskOverTimeData),
    datasets: [
      {
        label: 'Tasks over Time',
        data: Object.values(taskOverTimeData),
        borderColor: '#FF1493', // Deep Pink
        backgroundColor: 'rgba(255, 20, 147, 0.2)', // Light pink fill
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Prepare the Doughnut Chart data (Task Status Distribution)
  const statuses = ['Pending', 'Done', 'Delayed'];
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = allTasks.filter((task) => task.status === status).length;
    return acc;
  }, {});

  const doughnutData = {
    labels: ['Pending', 'Done', 'Delayed'],
    datasets: [
      {
        label: 'Task Status',
        data: [statusCounts.Pending, statusCounts.Done, statusCounts.Delayed],
        backgroundColor: ['#FFD700', '#32CD32', '#FF6347'], // Gold, Lime Green, Tomato
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="max-h-[100vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-4 h-[100vh] bg-gradient-to-r from-teal-400 to-blue-500">
      {/* Stacked Bar Graph (Tasks by Assignee) */}
      <div className="bg-white shadow-lg p-6 rounded-lg col-span-2">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tasks by Assignee</h3>
        <div style={{ height: '270px' }}>
          <Bar
            data={barData}
            options={{
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 14,
                      weight: 'bold',
                      family: 'Roboto, sans-serif',
                      color: 'gray',
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Doughnut Chart (Task Status Distribution) */}
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Status Distribution</h3>
        <div className="w-full flex justify-center items-center" style={{ height: '250px' }}>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Line Chart (Tasks Over Time) */}
      <div className="bg-white shadow-lg p-6 rounded-lg col-span-2">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tasks Over Time</h3>
        <div style={{ height: '250px', width: '80%' }}>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 14,
                      weight: 'bold',
                      family: 'Roboto, sans-serif',
                      color: 'gray',
                    },
                  },
                },
              },
              scales: {
                y: {
                  min: 0, // Ensure the y-axis starts from 0 for a clean view
                },
              },
            }}
          />
        </div>
      </div>

      {/* Pie Chart (Task Deadline Distribution) */}
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Deadline</h3>
        <div className="w-full flex justify-center items-center" style={{ height: '250px' }}>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardGraph;
