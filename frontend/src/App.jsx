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
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Protected App pages inside MainLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AIChat />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/chat" element={<Navigate to="/ai-chat" replace />} />

      <Route
        path="/emotion-detection"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EmotionDetection />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/emotion" element={<Navigate to="/emotion-detection" replace />} />

      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Progress />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/child-profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChildProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/profile" element={<Navigate to="/child-profile" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;