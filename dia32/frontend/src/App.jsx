import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import { UserProvider } from "./contexts/UserContext";
import { TaskProvider } from "./contexts/TaskContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Home from "./pages/Home";
import NewTask from "./pages/NewTask";
import EditTask from "./pages/EditTask";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";


export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TaskProvider>
                  <Layout />
                </TaskProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/new-task" element={<NewTask />} />
            <Route path="/edit/:id" element={<EditTask />} />
            <Route path="/task/:id" element={<TaskDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </ThemeProvider>
  );
}
