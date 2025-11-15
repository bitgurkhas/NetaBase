import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../src/pages/Home";
import Auth from "./pages/Auth";
import Header from "./components/Header";
import PoliticianDetail from "./pages/PoliticianDetail";
import UpcommingElection from "./pages/UpcommingElection";
import AboutPage from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import Party from "./pages/Party";

const App = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header isDark={isDark} setIsDark={setIsDark} />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/party" element={<Party />} />
        <Route path="/politician/:id" element={<PoliticianDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/election" element={<UpcommingElection />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
