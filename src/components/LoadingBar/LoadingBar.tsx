import { useState, useEffect } from "react";

function LoadingBar({ loading }: { loading: boolean }) {
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    let timer: any;
    if (loading) {
      setWidth(0);
      timer = setInterval(() => {
        setWidth((prev) => {
          if (prev < 90) {
            return prev + 1;
          } else {
            return prev;
          }
        });
      }, 50);
    } else {
      setWidth(100);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }

    return () => clearInterval(timer);
  }, [loading]);
  return (
    isVisible && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          backgroundColor: "#3498db",
          width: width + "%",
          transition: "width 0.2s linear",
          zIndex: 1000,
        }}
      />
    )
  );
}

export default LoadingBar;
