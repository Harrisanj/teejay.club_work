import { useRouter } from "next/router";
import { useLayoutEffect } from "react";

import { waitForElement } from "../../../utilities";

export function useScrollToComment() {
  const router = useRouter();
  useLayoutEffect(() => {
    if (typeof router.query.comment !== "string") {
      return;
    }
    waitForElement(`[data-comment-id="${router.query.comment}"]`).then(
      (element) =>
        element.scrollIntoView({ behavior: "smooth", block: "center" })
    );
  }, [router.query]);
}
