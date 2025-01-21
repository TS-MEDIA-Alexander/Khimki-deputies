import { useEffect } from "react";

import { Route, Routes, useLocation } from "react-router-dom";
import { ROUTER } from "./config";
import "./App.css";
/* Components */
import Footer from "./Components/Footer";
import Header from "./Components/Header";

/* Pages */
import Main from "./Pages/Main";
import NewsPage from "./Pages/News";
import NewsArticle from "./Pages/NewsArticle";
import Symbolism from "./Pages/Symbolism";
import Deputies from "./Pages/Deputies";
import CompositionStructure from "./Pages/CompositionStructure";
import Contacts from "./Pages/Contacts";

import PageNotFound from "./Pages/PageNotFound";
import Documents from "./Pages/Documents";
import LegalBasisActivity from "./Pages/LegalBasisActivity";
import Aсheck_endpoint from "./Pages/Aсheck_endpoint";
import Search from "./Pages/Search";
import CouncilLayout from "./Components/CouncilLayout";
import ScheduleReceptionDeputies from "./Components/ScheduleReceptionDeputies";
import AwardsCouncilDeputies from "./Components/AwardsCouncilDeputies";
import RulesParliamentaryEthics from "./Components/RulesParliamentaryEthics";

function App() {
  /* Чтобы через NavLink страница всегда открывалась в начале  */
  const location = useLocation();
  useEffect(() => {
    // Scroll top when location changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
      <Header />

      <div className="wrapper">
        <Routes>
          <Route path={ROUTER.Aсheck_endpoint} element={<Aсheck_endpoint />} />

          <Route path={ROUTER.main} element={<Main />} />
          <Route path={ROUTER.news} element={<NewsPage />} />
          <Route path={ROUTER.newsArticle} element={<NewsArticle />} />
          <Route path={ROUTER.documents} element={<Documents />} />
          <Route
            path={ROUTER.councilDeputies.legalBasisActivity}
            element={<LegalBasisActivity />}
          />
          <Route
            path={ROUTER.councilDeputies.symbolism}
            element={<Symbolism />}
          />
          <Route
            path={ROUTER.councilDeputies.deputies.main}
            element={<CouncilLayout />}
          >
            <Route
              path={ROUTER.councilDeputies.deputies.deputies}
              element={<Deputies />}
            />
            <Route
              path={ROUTER.councilDeputies.deputies.chart}
              element={<ScheduleReceptionDeputies />}
            />
            <Route
              path={ROUTER.councilDeputies.deputies.awards}
              element={<AwardsCouncilDeputies />}
            />
            <Route
              path={ROUTER.councilDeputies.deputies.rules}
              element={<RulesParliamentaryEthics />}
            />
          </Route>

          <Route
            path={ROUTER.councilDeputies.compositionStructure}
            element={<CompositionStructure />}
          />
          <Route path={ROUTER.contacts.main} element={<Contacts />} />
          <Route path={ROUTER.search} element={<Search />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
