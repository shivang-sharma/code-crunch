import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/HomePage";
import Explore from "./pages/ExplorePage";
import Leaderboard from "./pages/LeaderboardPage";
import ErrorPage from "./pages/ErrorPage";
import GettingStarted from "./pages/GettingStartedPage";
import Setting from "./pages/HomePage";
import ForgotPassswordPage from "./pages/ForgotPasswordPage";


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="gettingStarted" element={<GettingStarted />} />
          <Route path="setting" element={<Setting />} />
          <Route path="forgotPassword" element={<ForgotPassswordPage />} />
          <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
