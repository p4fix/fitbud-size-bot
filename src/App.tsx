
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { ProfileProvider } from './contexts/ProfileContext';
import { Toaster } from './components/ui/toaster';
import './App.css';

const App = () => {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ProfileProvider>
  );
};

export default App;
