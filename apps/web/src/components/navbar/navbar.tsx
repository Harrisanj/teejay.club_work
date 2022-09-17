import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { classNames } from "../../utilities";

import { LeftSide } from "./left-side";
import { RightSide } from "./right-side";

export const Navbar = observer(() => {
  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(document.documentElement.scrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header className="w-full fixed top-0 inset-x-0 z-20">
      <nav
        className={classNames(
          "flex bg-white px-4 py-2 h-14 items-center shadow-sm transition-all duration-300",
          { "shadow-lg": scrollTop > 0 }
        )}
      >
        <div className="w-full flex flex-row justify-between items-center z-20">
          <LeftSide />
          <RightSide />
        </div>
      </nav>
    </header>
  );
});
