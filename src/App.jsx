import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "../src/components/Layout";
import Home from "./pages/home/Home";
import ProfilePage from "./pages/profile/ProfilePage";
// import CreatePost from "./pages/create/CreatePost";
import Login from "./pages/login/Login";
import SignUpPage2 from "./pages/signup2/Signup2";
import CreateNewRecipe from "./pages/create/CreateNewRecipe";
import Profile from "./pages/profileById/Profile";
import EditRecipe from "./pages/edit/Edit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreateNewRecipe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage2 />} />
          <Route path="/profile/:authorId" element={<Profile />} />
          {/* <Route path="/create2" element={<CreatePost />} /> */}
          <Route path="/edit/:recipeId" element={<EditRecipe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;