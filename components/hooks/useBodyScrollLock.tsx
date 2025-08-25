import { useEffect } from 'react';


// Custom hook for body scroll lock
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    const scrollBarGap =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scroll-bar-gap",
      `${scrollBarGap}px`
    );

    if (locked) {
      document.body.classList.add("scroll-lock");
    } else {
      document.body.classList.remove("scroll-lock");
    }

    return () => {
      document.body.classList.remove("scroll-lock");
    };
  }, [locked]);
}