import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from '../src/components/Layout'
import Home from './Home'
import ProfilePage from './pages/profile/ProfilePage'
import CreatePost from './pages/create/CreatePost'

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreatePost />} />
          </Route>
        </Routes>
    </Router>
  )
}

export default App;