import React, { useEffect, useRef } from "react";

const MathComponent = ({ latex }) => {
  const mathRef = useRef(null); // Referință la elementul în care va fi randat LaTeX-ul

  useEffect(() => {
    if (window.MathJax) {
      // Declanșează MathJax pentru a randa LaTeX-ul după ce DOM-ul a fost actualizat
      window.MathJax.Hub.Queue([
        "Typeset",
        window.MathJax.Hub,
        mathRef.current,
      ]);
    }
  }, [latex]); // Actualizează doar când se schimbă latex

  return (
    <div>
      {/* Randăm direct LaTeX-ul folosind innerHTML */}
      <span ref={mathRef}>{latex}</span>
    </div>
  );
};

export default MathComponent;
