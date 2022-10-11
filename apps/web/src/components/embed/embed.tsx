import { memo, useMemo } from "react";

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
        <img alt={`Пост из ${type}`} />
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
