import React, { useState } from 'react';
import Prayer from "./components/prayer.jsx";
import Tsbih from "./components/tasbih.jsx";

function App() {
  const [showTsbih, setShowTsbih] = useState(false);
  const [showpryer, setShowprayer] = useState(true);

  const togglepray = () => {
    setShowprayer(!showpryer);
  };
  const toggleTsbih = () => {
    setShowTsbih(!showTsbih);
  };

  return (
    <>
    <div className="App">
      <main className="container">
      <button onClick={togglepray}> {showpryer ? "Hide Pray" : "Show Pray"}</button>{showpryer &&<Prayer />}
      <button onClick={toggleTsbih}> {showTsbih ? "Hide Tasbih" : "Show Tasbih"}</button>{showTsbih && <Tsbih />}
      </main>
    </div>
    </>
  );
}

export default App;
