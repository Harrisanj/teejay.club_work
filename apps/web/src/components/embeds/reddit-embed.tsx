import { memo, useEffect, useRef, useState } from "react";

import { classNames } from "../../utilities";
import { Spinner } from "../spinner";

type Props = {
  id: string;
};

export const RedditEmbed = memo<Props>(({ id }) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const frame = ref.current;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow) {
        return;
      }
      const data = JSON.parse(event.data);
      if (data.type === "resize.embed") {
        setHeight(data.data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      className={classNames(
        "relative flex flex-col justify-center items-center w-full border border-gray-300",
        { "min-h-[240px]": !height }
      )}
    >
      <Spinner isSpinning={!height} />
      <iframe
        ref={ref}
        title="Reddit Post"
        id="reddit-embed"
        src={`https://www.redditmedia.com/r${id}?ref_source=embed&amp;ref=share&amp;embed=true`}
        sandbox="allow-scripts allow-same-origin allow-popups"
        className="overflow-hidden border-none"
        width="100%"
        height={height}
        // eslint-disable-next-line react/no-unknown-property
        scrolling="no"
      />
    </div>
  );
});

RedditEmbed.displayName = "RedditEmbed";
