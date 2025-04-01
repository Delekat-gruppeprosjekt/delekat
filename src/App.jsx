import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "../src/components/Layout";
import Home from "./pages/home/Home";
//import ProfilePage from "./pages/profile/ProfilePageOLD";
import CreatePost from "./pages/create/CreatePost";
import Login from "./pages/login/Login";
import SignUpPage2 from "./pages/signup2/Signup2";
import CreateNewRecipe from "./pages/create/CreateNewRecipe";
import EditRecipe from "./pages/edit/Edit";
import ProfilePage from "./pages/profileById/ProfilePage";
import EditProfilePage from "./pages/edit/EditProfilePage";
import SingleRecipe from "./pages/details/SingleRecipe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/create" element={<CreateNewRecipe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage2 />} />
          <Route path="/create2" element={<CreatePost />} />
          <Route path="/edit/:recipeId" element={<EditRecipe />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/edit-profile/:userId" element={<EditProfilePage />} />
          <Route path="/recipe/:recipeId" element={<SingleRecipe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
