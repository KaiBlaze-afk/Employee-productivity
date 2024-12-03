import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
// import { useRecoilState } from 'recoil';
// import { taskListState } from './store/taskList';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [taskList, setTaskLIst] = useRecoilState(taskListState)

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // setTaskLIst()
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
