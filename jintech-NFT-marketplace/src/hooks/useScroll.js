import { useState, useEffect } from "react";

export function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  let timer;

  const listener = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      setScrollY(window.pageYOffset);
    }, 1000);
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  });

  return {
    scrollY,
  };
}
