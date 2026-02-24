import './App.css'
import Chart from './pages/Chart'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
