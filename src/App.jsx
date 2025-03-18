import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from '../src/components/Layout'
import Home from './Home'

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
    </Router>
  )
}

export default App;