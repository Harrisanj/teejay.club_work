import { PatternPasteEvent } from "@editorjs/editorjs";
import { AppRouter } from "@teejay/api";
import { ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";

import { clientSideTRPC } from "../../utilities";
import { Embed as EmbedRenderer } from "../embed";
import { Spinner } from "../spinner";

type Data = {
  type: string;
  payload: string;
  sources: AppRouter["embeds"]["create"]["_def"]["_output_out"];
};

const patterns = {
  telegram: /^https?:\/\/t\.me\/([^ ]*)$/,
  twitter: /^https?:\/\/twitter\.com\/[^ ]*$/,
  reddit: /^https:\/\/www\.reddit\.com\/r(\/.+\/comments\/.+\/.+\/)[^ ]*$/,
};

export class Embed {
  private data?: Data;
  private element?: HTMLSpanElement;
  private root?: Root;

  constructor({ data }: { data: Data }) {
    this.data = data;
  }

  static get pasteConfig() {
    return { patterns };
  }

  async onPaste(event: PatternPasteEvent) {
    const type = event.detail.key as keyof typeof patterns;
    const payload = (() => {
      const url = new URL(event.detail.data);
      switch (url.hostname) {
        case "t.me": {
          const matches = url.pathname.match(/^\/(.+\/\d+)/);
          if (!matches) {
            return;
          }
          return matches[1];
        }
        case "twitter.com": {
          const matches = url.pathname.match(/^\/.+\/status\/(\d+)/);
          if (!matches) {
            return;
          }
          return matches[1];
        }
        case "www.reddit.com": {
          const matches = url.pathname.match(/^(\/r\/.+\/comments\/.+\/.+\/)/);
          if (!matches) {
            return;
          }
          return matches[1];
        }
      }
    })();

    if (!payload) {
      this.renderChildren(
        <div className="p-1 bg-red-500">Неверный формат ссылки.</div>
      );
      return;
    }

    this.renderChildren(
      <div className="relative w-full h-60">
        <Spinner isSpinning={true} />
      </div>
    );

    const sources = await clientSideTRPC.embeds.create.mutate({
      type,
      payload,
    });

    this.data = {
      type,
      payload,
      sources,
    };

    this.renderChildren(
      <EmbedRenderer
        isSummary={false}
        type={type}
        payload={payload}
        sources={sources}
      />
    );
  }

  render() {
    this.element = document.createElement("span");
    this.element.className = "flex flex-col items-center";

    this.root = createRoot(this.element);

    if (this.data) {
      this.renderChildren(
        <EmbedRenderer
          isSummary={false}
          type={this.data.type}
          payload={this.data.payload}
          sources={this.data.sources}
        />
      );
    }

    return this.element;
  }

  renderChildren(node: ReactNode) {
    if (!this.data || !this.root) {
      return;
    }

    this.root.render(node);
  }

  save() {
    return this.data;
  }
}
