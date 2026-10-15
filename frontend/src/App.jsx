import { Routes, Route, BrowserRouter } from 'react-router-dom';
import GamesListPage from './pages/GamesListPage';
import GameDetailsPage from './pages/GameDetailsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import './styles/App.css';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import JournalPage from './pages/JournalPage';

function App() {
 

  return (
    <BrowserRouter>
      <div className="app-container"> 
        <Navbar />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/games" element={<GamesListPage />} />
          <Route path="/games/:id" element={<GameDetailsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
