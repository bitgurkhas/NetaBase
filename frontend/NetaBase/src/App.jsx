import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../src/pages/Home";
import Header from "./components/Header";
import PoliticianDetail from "./pages/PoliticianDetail";
import UpcommingElection from "./pages/UpcommingElection";
import AboutPage from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import Party from "./pages/Party";
import News from "./pages/News";
import AuthInitializer from "./components/AuthInitializer";

const App = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <BrowserRouter>
      <AuthInitializer>
        <ScrollToTop />
        <Header isDark={isDark} setIsDark={setIsDark} />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/party" element={<Party />} />
          <Route path="/politician/:slug" element={<PoliticianDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/election" element={<UpcommingElection />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
};

export default App;
