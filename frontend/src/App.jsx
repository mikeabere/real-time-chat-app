import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <Routes>
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/chatpage" element={<ChatPage />} />
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <h1>Hello world</h1>
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default App;
