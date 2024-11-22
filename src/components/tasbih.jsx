import React, { useState, useEffect, useCallback } from "react";
import "./Tasbih.css";

function Tsbih() {
  const [count, setCount] = useState(0);
  const [phrase, setPhrase] = useState("سبحان الله Subhan allah");
  const phrases = [
    "سبحان الله Subhan allah",
    "الحمد لله Alhamd lallah",
    "الله أكبر Allah akbar",
  ];
  const specialPhrase = "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير";

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);

    if (newCount % 100 === 0) {
      setPhrase(specialPhrase);
    } else {
      setPhrase(phrases[(newCount - 1) % phrases.length]);
    }
  };

  const handleReset = () => {
    setCount(0);
    setPhrase(phrases[0]);
  };

  const sendClickCount = useCallback(async (clickCount) => {
    try {
      const response = await fetch("save_click.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ click_count: clickCount }),
      });

      if (!response.ok) {
        console.error("Failed to send click count to the server.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sendClickCount(count);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [count, sendClickCount]);

  return (
    <div className="App">
      <main className="container">
      <header>
        <h1>Click and Remember</h1>
      </header>
      <main className="p-5 rounded-4 container-fluid d-flex flex-column align-items-center about-container">
        <div className="button-container text-center">
          <button id="clickable-div" className="btn btn-primary py-3 px-5 mb-3" onClick={handleClick}><div id="phrase-display">{phrase}  
          <span style={{ color: "black" }} className="top_right">{count}</span></div></button>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button id="reset" className="btn btn-outline-secondary" onClick={handleReset}> Reset</button>
        </div>
      </main>
      </main>
    </div>
  );
}

export default Tsbih;
