// ============================================================================
// App.jsx
// ============================================================================
import React, { useState } from 'react';
import { GlobeJourneyView } from "./pages/GlobeJourneyView";
import { LogisticsPortal } from "./pages/LogisticsPortal";
import { ProducerPortal } from "./pages/ProducerPortal";

export default function App() {
  const [page, setPage] = useState('home');
  const [pageData, setPageData] = useState(null);

  const handleSetPage = (newPage, data = null) => {
    setPage(newPage);
    setPageData(data);
  };

  return (
    <>
      {page === 'home' && <LogisticsPortal setPage={handleSetPage} />}
      {page === 'producer' && <ProducerPortal setPage={handleSetPage} />}
      {page === 'customer' && <GlobeJourneyView setPage={handleSetPage} data={pageData} />}
    </>
  );
}