import { RefObject, useCallback, useEffect, useState } from "react";

export const useIntersectionRatio = (
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  const handleIntersect = useCallback<IntersectionObserverCallback>(
    (entries) => {
      const entry = entries[0];
      if (intersectionRatio !== entry.intersectionRatio) {
        setIntersectionRatio(entry.intersectionRatio);
      }
    },
    [intersectionRatio]
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, options, ref]);

  return intersectionRatio;
};
