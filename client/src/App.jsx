import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add other routes later for dashboard, sweets, etc. */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;