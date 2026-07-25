import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ResultPage from "./pages/ResultPage";

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
