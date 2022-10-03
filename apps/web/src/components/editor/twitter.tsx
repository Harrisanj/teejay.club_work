import { PatternPasteEvent } from "@editorjs/editorjs";
import { createRoot, Root } from "react-dom/client";

import { TwitterEmbed } from "../embeds";

type Data = { id: string };

export class Twitter {
  private data?: Data;
  private element?: HTMLSpanElement;
  private root?: Root;

  constructor({ data }: { data: Data }) {
    this.data = data;
  }

  static get pasteConfig() {
    return {
      patterns: {
        id: /^https?:\/\/twitter\.com\/[^ ]*$/,
      },
    };
  }

  onPaste(event: PatternPasteEvent) {
    let url;
    try {
      url = new URL(event.detail.data);
    } catch (error) {
      return;
    }

    if (url.hostname !== "twitter.com") {
      return;
    }

    const matches = url.pathname.match(/\/.+\/status\/(\d+)/);

    if (!matches) {
      return;
    }

    this.data = { id: matches[1] };
    this.renderChildren();
  }

  render() {
    this.element = document.createElement("span");
    this.element.className = "flex flex-col items-center";

    this.root = createRoot(this.element);

    this.renderChildren();

    return this.element;
  }

  renderChildren() {
    if (!this.data || !this.root) {
      return;
    }
    this.root.render(<TwitterEmbed id={this.data.id} />);
  }

  save() {
    return this.data;
  }
}
