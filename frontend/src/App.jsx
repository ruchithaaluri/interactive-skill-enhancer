import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import EmotionDetection from "./pages/EmotionDetection";
import Progress from "./pages/Progress";
import ChildProfile from "./pages/ChildProfile";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App pages inside MainLayout */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <MainLayout>
            <AIChat />
          </MainLayout>
        }
      />
      <Route path="/chat" element={<Navigate to="/ai-chat" replace />} />

      <Route
        path="/emotion-detection"
        element={
          <MainLayout>
            <EmotionDetection />
          </MainLayout>
        }
      />
      <Route path="/emotion" element={<Navigate to="/emotion-detection" replace />} />

      <Route
        path="/progress"
        element={
          <MainLayout>
            <Progress />
          </MainLayout>
        }
      />

      <Route
        path="/child-profile"
        element={
          <MainLayout>
            <ChildProfile />
          </MainLayout>
        }
      />
      <Route path="/profile" element={<Navigate to="/child-profile" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;