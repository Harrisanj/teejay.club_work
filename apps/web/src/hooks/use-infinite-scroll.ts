import { RefObject, useCallback, useEffect } from "react";

export function useInfiniteScroll(
  isFetching: boolean,
  hasNextPage = false,
  fetchNextPage: () => void,
  elementRef?: RefObject<HTMLDivElement>
) {
  const handleScroll = useCallback(() => {
    if (isFetching || !hasNextPage) {
      return;
    }

    const element = elementRef ? elementRef.current : document.documentElement;

    if (!element) {
      return;
    }

    if (element.scrollTop + element.clientHeight * 2 < element.scrollHeight) {
      return;
    }

    fetchNextPage();
  }, [isFetching, hasNextPage, fetchNextPage, elementRef]);

  useEffect(() => {
    const element = !elementRef ? window : elementRef.current;

    if (!element) {
      return;
    }

    element.addEventListener("scroll", handleScroll);
    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [elementRef, handleScroll]);
}
