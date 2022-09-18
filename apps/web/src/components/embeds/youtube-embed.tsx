import { memo, useEffect, useRef, useState } from "react";

type Props = {
  id: string;
};

export const YoutubeEmbed = memo<Props>(({ id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) {
        return;
      }
      setHeight(ref.current.clientHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={ref} className={"relative w-full pb-[56.25%]"}>
      <iframe
        title="Telegram Post"
        src={`https://www.youtube.com/embed/${id}`}
        width="100%"
        height={height}
        className="absolute inset-0 overflow-hidden"
        // eslint-disable-next-line react/no-unknown-property
        scrolling="no"
      />
    </div>
  );
});

YoutubeEmbed.displayName = "YoutubeEmbed";
