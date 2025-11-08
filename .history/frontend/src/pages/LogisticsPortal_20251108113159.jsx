import React, { useState } from 'react';
// Make sure to import the component correctly
import { QrReader } from 'react-qr-reader'; 

function LogisticsPortal() {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);

  // This function is called when a QR code is successfully scanned
  const handleScan = (result, error) => {
    if (!!result) {
      // result is an object. The text data is in result.text
      const textData = result.text;
      console.log("QR Code Scanned:", textData);
      setScannedData(textData);
    }

    if (!!error) {
      console.info(error)
    }
  };

  return (
    <div style={{ width: '400px', margin: 'auto' }}>
      <h2>Scan Batch QR Code</h2>

      {/* The QR Reader Component */}
      <QrReader
        onResult={handleScan}
        // This is important for mobile users to get the back camera
        constraints={{ facingMode: 'environment' }}
        style={{ width: '100%' }}
      />

      {/* This will show the data after you scan it */}
      {scannedData ? (
        <div>
          <h3>Scanned Data:</h3>
          <p>{scannedData}</p>
        </div>
      ) : (
        <p>Point your camera at a QR code...</p>
      )}
    </div>
  );
}

export default LogisticsPortal;