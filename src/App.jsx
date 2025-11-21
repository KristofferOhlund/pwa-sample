import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Pwa from "./components/pwa";
import Web from "./components/web";

function App() {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    // set initialValue
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    setIsPwa(mediaQuery.matches);

    // Update value on change
    const listener = (event) => {
      setIsPwa(event.matches);
    }

    // Add event
    mediaQuery.addEventListener("change", listener);

    // clean-up to avoid multiple eventListeners
    return () => {
      mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const RenderComponent = isPwa ? Pwa : Web;

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RenderComponent className="pwa" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
