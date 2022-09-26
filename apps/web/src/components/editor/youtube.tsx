import { PatternPasteEvent } from "@editorjs/editorjs";
import { createRoot, Root } from "react-dom/client";

import { YoutubeEmbed } from "../embeds";

const REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)$/;

type Data = { id: string };

export class Youtube {
  private data?: Data;
  private element?: HTMLSpanElement;
  private root?: Root;

  constructor({ data }: { data: Data }) {
    this.data = data;
  }

  static get pasteConfig() {
    return { patterns: { id: REGEX } };
  }

  onPaste(event: PatternPasteEvent) {
    const matches = event.detail.data.match(REGEX);
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

    this.root.render(<YoutubeEmbed id={this.data.id} />);
  }

  save() {
    return this.data;
  }
}
