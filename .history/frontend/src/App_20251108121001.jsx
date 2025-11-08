// ============================================================================
// App.jsx
// ============================================================================
import React, { useState } from 'react';
import { CustomerView } from "./pages/CustomerView";
import { LogisticsPortal } from "./pages/LogisticsPortal";
import { ProducerPortal } from "./pages/ProducerPortal";

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <>
      {page === 'home' && <LogisticsPortal setPage={setPage} />}
      {page === 'producer' && <ProducerPortal setPage={setPage} />}
      {page === 'customer' && <CustomerView setPage={setPage} />}
    </>
  );
}