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
