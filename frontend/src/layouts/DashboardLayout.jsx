import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import EmotionDetection from "./pages/EmotionDetection";
import Progress from "./pages/Progress";
import ChildProfile from "./pages/ChildProfile";

import DashboardLayout from "./layouts/DashboardLayout";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>

      {/* Public Pages */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Layout */}

      <Route element={<DashboardLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/chat" element={<AIChat />} />

        <Route
          path="/emotion"
          element={<EmotionDetection />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/profile"
          element={<ChildProfile />}
        />

      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;