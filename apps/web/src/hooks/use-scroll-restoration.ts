import { useEffect } from "react";

export function useScrollRestoration() {
  useEffect(() => {
    const handleScroll = () => {
      history.replaceState(
        {
          ...history.state,
          tjScrollPosition: window.scrollY,
        },
        ""
      );
    };

    let timeoutId = -1;
    const handlePopState = () => {
      const top = +history.state.tjScrollPosition;
      window.scroll({ top });
      timeoutId = window.setTimeout(() => {
        window.scroll({ top });
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
      window.clearTimeout(timeoutId);
    };
  }, []);
}
