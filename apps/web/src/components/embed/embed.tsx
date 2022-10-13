import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { getEmbedUrl } from "../../utilities";

type Props = {
  isSummary: boolean;
  type: string;
  payload: string;
  sources: {
    uuid: string;
    media: string;
    size: {
      width: number;
      height: number;
    };
  }[];
};

export const Embed = memo<Props>(({ type, payload, sources, isSummary }) => {
  const url = useMemo(() => {
    if (type === "telegram") {
      return `https://t.me/${payload}`;
    }
    if (type === "twitter") {
      return `https://twitter.com/_/status/${payload}`;
    }
    if (type === "reddit") {
      return `https://www.reddit.com${payload}`;
    }
  }, [type, payload]);

  // hack for firefox
  // TODO: wait firefox fix
  const calculateWidth = useCallback(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    return sources.reduce((width, source) => {
      const { matches } = window.matchMedia(source.media);
      if (matches) {
        return Math.max(width, source.size.width);
      }
      return width;
    }, 0);
  }, [sources]);

  const [width, setWidth] = useState<number>();

  const recalculateWidth = useCallback(() => {
    const width = calculateWidth();
    setWidth(width);
  }, [calculateWidth]);

  useEffect(() => {
    recalculateWidth();
    window.addEventListener("resize", recalculateWidth);
    return () => {
      window.removeEventListener("resize", recalculateWidth);
    };
  }, [recalculateWidth]);

  let children = (
    <div className="flex items-center justify-center">
      <picture>
        {sources.map((source) => (
          <source
            key={source.uuid}
            srcSet={getEmbedUrl(source.uuid)}
            media={source.media}
            width={source.size.width}
            height={source.size.height}
          />
        ))}
        <img alt={`Пост из ${type}`} style={{ width }} />
      </picture>
    </div>
  );

  if (!isSummary) {
    children = (
      <a
        className="block border-none"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return <div className="flex items-center justify-center">{children}</div>;
});

Embed.displayName = "Embed";
