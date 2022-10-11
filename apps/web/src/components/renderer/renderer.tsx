import { OutputBlockData, OutputData } from "@editorjs/editorjs";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { memo } from "react";

import { classNames, sanitizeHtml } from "../../utilities";
import { Embed } from "../embed";
import { YoutubeEmbed, RedditEmbed } from "../embeds";
import { Link } from "../link";

const TwitterEmbed = dynamic(
  () => import("../embeds").then((i) => i.TwitterEmbed),
  { ssr: false }
);

const TelegramEmbed = dynamic(
  () => import("../embeds").then((i) => i.TelegramEmbed),
  { ssr: false }
);

type Props = {
  isSummary?: boolean;
  children: OutputData;
};

export const Renderer = memo<Props>(({ isSummary = false, children }) => {
  if (!Array.isArray(children.blocks)) {
    return null;
  }

  if (isSummary) {
    return (
      <div className="content flex flex-col gap-y-3">
        {renderBlock(children.blocks[0], isSummary)}
        {children.blocks.length > 1 && (
          <div className="text-blue-500 text-sm inline-flex flex-row items-center">
            Читать дальше <ChevronRightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="content flex flex-col gap-y-3">
      {children.blocks.map((block) => renderBlock(block, isSummary))}
    </div>
  );
});

function renderBlock(block: OutputBlockData, isSummary: boolean) {
  if (!block) {
    return null;
  }

  if (block.type === "header") {
    return <h2 key={block.id}>{block.data.text}</h2>;
  }

  if (block.type === "paragraph") {
    const __html = sanitizeHtml(block.data.text, isSummary);
    return <p key={block.id} dangerouslySetInnerHTML={{ __html }} />;
  }

  if (block.type === "image") {
    return (
      <div
        key={block.id}
        className={classNames("ce-block", {
          "ce-block--stretched": block.data.stretched,
        })}
      >
        <div className="ce-block__content">
          <div
            className={classNames("cdx-block image-tool image-tool--filled", {
              "image-tool--stretched": block.data.stretched,
              "image-tool--withBackground": block.data.withBackground,
              "image-tool--withBorder": block.data.withBorder,
            })}
          >
            {isSummary ? (
              <div className="image-tool__image border-none">
                <img
                  className="image-tool__image-picture"
                  src={block.data.url ?? block.data.file.url}
                  alt={block.data.caption}
                />
              </div>
            ) : (
              <Link
                href={block.data.url ?? block.data.file.url}
                className="image-tool__image border-none"
              >
                <img
                  className="image-tool__image-picture"
                  src={block.data.url ?? block.data.file.url}
                  alt={block.data.caption}
                />
              </Link>
            )}

            <div className="cdx-input image-tool__caption">
              {block.data.caption}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "list") {
    const Tag = block.data.style === "ordered" ? "ol" : "ul";
    return (
      <Tag key={block.id}>
        {/* @ts-ignore */}
        {block.data.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </Tag>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote key={block.id}>
        <p className="not-italic">{block.data.text}</p>
        <p className="text-small">— {block.data.caption}</p>
      </blockquote>
    );
  }

  if (block.type === "delimiter") {
    return <div key={block.id} className="ce-delimiter"></div>;
  }

  if (block.type === "embed") {
    return (
      <Embed
        key={block.id}
        isSummary={isSummary}
        type={block.data.type}
        payload={block.data.payload}
        sources={block.data.sources}
      />
    );
  }

  if (block.type === "youtube") {
    return <YoutubeEmbed key={block.id} id={block.data.id} />;
  }

  // TODO: delete in the future
  if (block.type === "telegram") {
    return <TelegramEmbed key={block.id} id={block.data.id} />;
  }

  // TODO: delete in the future
  if (block.type === "twitter") {
    return <TwitterEmbed key={block.id} id={block.data.id} />;
  }

  // TODO: delete in the future
  if (block.type === "reddit") {
    return <RedditEmbed key={block.id} id={block.data.id} />;
  }

  return null;
}

Renderer.displayName = "Renderer";
