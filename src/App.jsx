import { useCallback, useState } from "react";
import "./App.css";
import P2PSlider from "./components/P2PSlider";

function App() {
  const [isAccept, setIsAccept] = useState(null);

  const handleAction = useCallback((action) => {
    setIsAccept(action === "accept");
  }, []);

  return (
    <>
      <P2PSlider handleAction={handleAction} />

      {isAccept !== null && isAccept && (
        <div className="action-message">Accepted</div>
      )}
      {isAccept !== null && !isAccept && (
        <div className="action-message">Declined</div>
      )}
    </>
  );
}

export default App;
