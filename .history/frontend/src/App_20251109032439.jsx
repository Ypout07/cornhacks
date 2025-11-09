// ============================================================================
// App.jsx
// ============================================================================
import React, { useState } from 'react';
import { AboutPage } from "./pages/AboutPage";
import { GlobeJourneyView } from "./pages/GlobeJourneyView";
import { LogisticsPortal } from "./pages/LogisticsPortal";
import { ProducerPortal } from "./pages/ProducerPortal";
import { StepsPage } from "./pages/StepsPage";

export default function App() {
  const [page, setPage] = useState('home');
  const [pageData, setPageData] = useState(null);
  const [scrollSection, setScrollSection] = useState(null);  // ADD THIS LINE
  const [stepNumber, setStepNumber] = useState(null);


  const handleSetPage = (newPage, data = null, scrollSection = null) => {  // ADD scrollSection parameter
    
    setPage(newPage);
    setPageData(data);
    setScrollSection(scrollSection);  // ADD THIS LINE
    setStepNumber(step);
  };

  

  return (
    <>
      {page === 'home' && <LogisticsPortal setPage={handleSetPage} />}
      {page === 'producer' && <ProducerPortal setPage={handleSetPage} />}
      {page === 'customer' && <GlobeJourneyView setPage={handleSetPage} data={pageData} />}
      {page === 'about' && <AboutPage setPage={handleSetPage} scrollToSection={scrollSection} />}  {/* ADD scrollToSection prop */}
      {page === 'steps' && <StepsPage setPage={handleSetPage} selectedStep={stepNumber} />}


    </>
  );
}
