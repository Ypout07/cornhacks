// ============================================================================
// App.jsx
// ============================================================================
import React, { useState } from 'react';
import { CustomerView } from './CustomerView';
import { LogisticsPortal } from './LogisticsPortal';
import { ProducerPortal } from './ProducerPortal';

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