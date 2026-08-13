import { Routes, Route } from "react-router";

import Layout from "./Layout";

import HomePage from "./pages/Home/Home";

//---Pieces---
import AllPiecesPage from "./pages/Pieces/AllPieces/AllPieces";
import CreatePiecePage from "./pages/Pieces/CreatePiece/CreatePiece";
import EditPiecePage from "./pages/Pieces/EditPiece/EditPiece";

//View Piece
import ViewPiecePage from "./pages/Pieces/ViewPiece/ViewPiece";
import OverviewSection from "./pages/Pieces/ViewPiece/OverviewSection";
import GoalsSection from "./pages/Pieces/ViewPiece/GoalsSection";
import SessionsSection from "./pages/Pieces/ViewPiece/SessionsSection";
import ResourcesSection from "./pages/Pieces/ViewPiece/ResourcesSection";
import TermsSection from "./pages/Pieces/ViewPiece/TermsSection";
import AnalyticsSection from "./pages/Pieces/ViewPiece/AnalyticsSection";

//Sessions
import AllSessionsPage from "./pages/Session/AllSessions/AllSessions";
import ViewSessionPage from "./pages/Session/ViewSession/ViewSession";

import GlossaryPage from "./pages/Glossary/Glossary";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* ----Pieces---- */}
        <Route path="pieces" element={<AllPiecesPage />}></Route>
        <Route path="piece/create" element={<CreatePiecePage />}></Route>
        <Route path="piece/:id/view" element={<ViewPiecePage />}>
          <Route index element={<OverviewSection />} />
          <Route path="goals" element={<GoalsSection />} />
          <Route path="sessions" element={<SessionsSection />} />
          <Route path="resources" element={<ResourcesSection />} />
          <Route path="terms" element={<TermsSection />} />
          <Route path="analytics" element={<AnalyticsSection />} />
        </Route>
        <Route path="piece/:id/edit" element={<EditPiecePage />}></Route>

        {/* ----Sessions---- */}
        <Route path="sessions" element={<AllSessionsPage />} />
        <Route path="sessions/:id/view" element={<ViewSessionPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
      </Route>
    </Routes>
  );
}
