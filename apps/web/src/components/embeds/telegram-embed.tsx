import { memo, useEffect, useRef, useState } from "react";

import { classNames } from "../../utilities";
import { Spinner } from "../spinner";

type Props = {
  id: string;
};

export const TelegramEmbed = memo<Props>(({ id }) => {
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
      if (data.event === "resize") {
        setHeight(data.height);
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
        "relative flex flex-col justify-center items-center w-full",
        { "min-h-[240px]": !height }
      )}
    >
      <Spinner isSpinning={!height} />
      <iframe
        ref={ref}
        title="Telegram Post"
        src={`https://t.me/${id}?embed=1&amp;userpic=true`}
        width="100%"
        height={height}
        className="overflow-hidden border-none min-w-[320px]"
        allowFullScreen={true}
        // eslint-disable-next-line react/no-unknown-property
        scrolling="no"
      />
    </div>
  );
});

TelegramEmbed.displayName = "TelegramEmbed";
