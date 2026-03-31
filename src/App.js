import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="nav-bar">
          <div className="nav-brand">
            🏗️ Building Safety Inspector
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">📋 Главная</Link>
            <Link to="/add" className="nav-link">➕ Добавить</Link>
          </div>
        </div>
        <div className="content-card">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/add" element={<Form />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
