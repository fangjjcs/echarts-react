import { useState, useEffect } from "react";

export default function useWindowSize(offsetX, offsetY) {

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    
    function handleResize() {
      setWindowSize({
        width: window.innerWidth - offsetX,
        height: window.innerHeight - offsetY
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); 

  return windowSize;
}