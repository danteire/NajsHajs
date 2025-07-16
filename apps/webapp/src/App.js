import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResultsPage from './ResultPage';
import MenuPage from "./components/MenuPage";

function App() {
  return (
      <Router>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Routes>
            {/*<Route path="/" element={<UploadPage />} />*/}
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/" element={<MenuPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;