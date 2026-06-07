import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import ToastContainer from './components/Toast';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import TemplatePage from './pages/TemplatePage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="template" element={<TemplatePage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}
