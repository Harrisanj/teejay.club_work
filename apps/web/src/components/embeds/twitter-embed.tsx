import { memo, useEffect, useRef, useState } from "react";

import { classNames } from "../../utilities";
import { Spinner } from "../spinner";

type Props = {
  id: string;
};

export const TwitterEmbed = memo<Props>(({ id }) => {
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
      const data = event.data["twttr.embed"];
      if (data.method !== "twttr.private.resize") {
        return;
      }
      setHeight(data.params[0].height);
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
        height={height}
        className="w-full  max-w-lg overflow-hidden"
        title="Twitter Tweet"
        src={`https://platform.twitter.com/embed/Tweet.html?dnt=false&embedId=twitter-widget-0&features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOlsibGlua3RyLmVlIiwidHIuZWUiXSwidmVyc2lvbiI6bnVsbH0sInRmd19ob3Jpem9uX3RpbWVsaW5lXzEyMDM0Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfY2hpbl9waWxsc18xNDc0MSI6eyJidWNrZXQiOiJjb2xvcl9pY29ucyIsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfcmVzdWx0X21pZ3JhdGlvbl8xMzk3OSI6eyJidWNrZXQiOiJ0d2VldF9yZXN1bHQiLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3NlbnNpdGl2ZV9tZWRpYV9pbnRlcnN0aXRpYWxfMTM5NjMiOnsiYnVja2V0IjoiaW50ZXJzdGl0aWFsIiwidmVyc2lvbiI6bnVsbH0sInRmd19leHBlcmltZW50c19jb29raWVfZXhwaXJhdGlvbiI6eyJidWNrZXQiOjEyMDk2MDAsInZlcnNpb24iOm51bGx9LCJ0ZndfZHVwbGljYXRlX3NjcmliZXNfdG9fc2V0dGluZ3MiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3R3ZWV0X2VkaXRfZnJvbnRlbmQiOnsiYnVja2V0Ijoib2ZmIiwidmVyc2lvbiI6bnVsbH19&frame=false&hideCard=false&hideThread=false&id=${id}&lang=ru&origin=http%3A%2F%2Flocalhost%3A8043%2Fposts%2F1168&theme=light&widgetsVersion=1bfeb5c3714e8%3A1661975971032&width=550px`}
        allowFullScreen={true}
        // eslint-disable-next-line react/no-unknown-property
        scrolling="no"
      />
    </div>
  );
});

TwitterEmbed.displayName = "TwitterEmbed";
