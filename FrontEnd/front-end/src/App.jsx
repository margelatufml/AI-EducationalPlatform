import "./App.css";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SubjectsPage from "./pages/SubjectsPage/SubjectsPage";
import PricingPage from "./pages/PricingPage/PricingPage";
import MainPage from "./pages/MainPage";
import LeaderboardPage from "./pages/Leaderboards/LeaderboardPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import LogoutPage from "./pages/LogoutPage";
import Chapter from "./pages/Chapters/Chapter";
import MainPageForUser from "./pages/MainPageForUser";
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import UsersAdminPage from "./pages/UsersAdminPage";
import ExercisesAdminPage from "./pages/ExercisesAdminPage";
import ChapterAdminPage from "./pages/ChapterAdminPage";
import ClassForUser from "./pages/ClassesAdmin";
import TermeniSiConditii from "./pages/TermeniSiConditi";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackForm from "./pages/Form_Personality_Questions";
import MainPageBeforLogIn from "./pages/MainPageBeforLogIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPageBeforLogIn />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route
          path="/admin/*"
          element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
        >
          <Route path="ChapterAdminPage" element={<ChapterAdminPage />} />
          <Route path="ExercisesAdminPage" element={<ExercisesAdminPage />} />
          <Route path="UsersAdminPage" element={<UsersAdminPage />} />
          <Route path="ClassForUser" element={<ClassForUser />} />
          <Route path="MainPage" element={<MainPage />} />
          <Route path="LogoutPage" element={<LogoutPage />} />
        </Route>
        <Route
          path="/user/*"
          element={<ProtectedRoute allowedRoles={["USER"]} />}
        >
          <Route path="MainPageForUser" element={<MainPageForUser />} />
          <Route path="ProfilePage" element={<ProfilePage />} />
          <Route path="Subjects" element={<SubjectsPage />} />
          <Route path="Pricing" element={<PricingPage />} />
          <Route path="Chapters" element={<Chapter />} />
          <Route path="Leaderboard" element={<LeaderboardPage />} />
          <Route path="LogoutPage" element={<LogoutPage />} />
          <Route path="QuestionPage" element={<QuestionPage />} />
          <Route path="TermeniSiConditi" element={<TermeniSiConditii />} />
          <Route path="Form" element={<FeedbackForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
