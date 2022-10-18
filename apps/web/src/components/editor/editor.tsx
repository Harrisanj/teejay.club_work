import { OutputData } from "@editorjs/editorjs";
import { Component } from "react";

import { extractAccessToken } from "../../utilities";

import { Embed } from "./embed";
import { Reddit } from "./reddit";
import { Telegram } from "./telegram";
import { Twitter } from "./twitter";
import { Youtube } from "./youtube";

type Props = {
  placeholder: string;
  value: OutputData;
  onChange: (value: OutputData) => void;
};

export class Editor extends Component<Props> {
  editor?: Promise<import("@editorjs/editorjs").default>;

  shouldComponentUpdate() {
    return false;
  }

  async componentDidMount() {
    if (this.editor) {
      return;
    }

    this.editor = import("@editorjs/editorjs").then(
      async ({ default: EditorJS }) => {
        const tools = await this.fetchTools();
        return new EditorJS({
          // @ts-ignore
          logLevel: "WARN",
          holder: "editorjs",
          placeholder: this.props.placeholder,
          data: this.props.value,
          onChange: async (api) => {
            const value = await api.saver.save();
            this.props.onChange(value);
          },
          onReady: () => {
            const title =
              document.querySelector<HTMLInputElement>("#title-input");
            if (title) {
              title.addEventListener("keydown", async (event) => {
                if (event.code === "Enter") {
                  event.preventDefault();
                  const editor = await this.editor;
                  if (!editor) {
                    return;
                  }
                  editor.focus();
                }
              });
            }
          },
          // @ts-ignore
          tools,
          minHeight: 40,
          i18n: {
            messages: {
              ui: {
                blockTunes: {
                  toggler: {
                    "Click to tune": "Нажмите, чтобы настроить",
                    "or drag to move": "или перетащите",
                  },
                },
                inlineToolbar: {
                  converter: {
                    "Convert to": "Конвертировать в",
                  },
                },
                toolbar: {
                  toolbox: {
                    Add: "Добавить",
                    Filter: "Поиск...",
                    "Nothing found": "Ничего не найдено",
                  },
                },
              },
              toolNames: {
                Text: "Параграф",
                Link: "Ссылка",
                Bold: "Полужирный",
                Italic: "Курсив",

                Heading: "Заголовок",
                Image: "Изображение",
                List: "Список",
                Quote: "Цитата",
                Delimiter: "Разделитель",
              },
              tools: {
                link: {
                  "Добавить ссылку": "",
                },
                stub: {
                  "Блок не может быть отображен корректно.": "",
                },
                list: {
                  Ordered: "Нумерованный",
                  Unordered: "Маркированный",
                },
              },
              blockTunes: {
                delete: {
                  Delete: "Удалить",
                },
                moveUp: {
                  "Move up": "Переместить вверх",
                },
                moveDown: {
                  "Move down": "Переместить вниз",
                },
              },
            },
          },
        });
      }
    );
  }

  async fetchTools() {
    const [Header, Image, list, Quote, delimiter] = await Promise.all([
      // @ts-ignore
      import("@editorjs/header").then((i) => i.default),
      // @ts-ignore
      import("@editorjs/image").then((i) => i.default),
      // @ts-ignore
      import("@editorjs/list").then((i) => i.default),
      // @ts-ignore
      import("@editorjs/quote").then((i) => i.default),
      // @ts-ignore
      import("@editorjs/delimiter").then((i) => i.default),
    ]);
    return {
      header: {
        class: Header,
        config: {
          placeholder: "Введите заголовок...",
          defaultLevel: 2,
          levels: [2],
          inlineToolbar: false,
        },
      },
      image: {
        class: Image,
        config: {
          captionPlaceholder: "Введите описание изображения...",
          uploader: {
            uploadByFile: async (file: File) => {
              const accessToken = extractAccessToken(document.cookie);

              const body = new FormData();
              body.set("file", file);

              const response = await fetch(
                (process.env.NEXT_PUBLIC_API_HOSTNAME ?? "") + "/images",
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${accessToken}` },
                  body,
                }
              );

              const { id } = await response.json();

              return {
                success: 1,
                file: {
                  url:
                    (process.env.NEXT_PUBLIC_API_HOSTNAME ?? "") +
                    `/images/${id}`,
                },
              };
            },
            uploadByUrl: async (url: string) => {
              const accessToken = extractAccessToken(document.cookie);

              const body = new FormData();
              body.set("url", url);

              const response = await fetch(
                (process.env.NEXT_PUBLIC_API_HOSTNAME ?? "") + "/images",
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${accessToken}` },
                  body,
                }
              );

              const { id } = await response.json();

              return {
                success: 1,
                file: {
                  url:
                    (process.env.NEXT_PUBLIC_API_HOSTNAME ?? "") +
                    `/images/${id}`,
                },
              };
            },
          },
        },
      },
      list,
      quote: {
        class: Quote,
        config: {
          quotePlaceholder: "Введите цитату...",
          captionPlaceholder: "Введите автора цитаты...",
        },
      },
      delimiter,
      embed: Embed,
      youtube: Youtube,
      // TODO: delete in the future
      telegram: Telegram,
      twitter: Twitter,
      reddit: Reddit,
    };
  }

  render() {
    return <div id="editorjs"></div>;
  }
}
