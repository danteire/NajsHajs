import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './UploadPage';
import ResultsPage from './ResultPage';

function App() {
  return (
      <Router>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;