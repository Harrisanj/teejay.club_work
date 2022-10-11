import sanitize, { Transformer } from "sanitize-html";

export const sanitizeHtml = (html: string, isSummary: boolean) => {
  const transformAnchor: Transformer = isSummary
    ? () => ({
        tagName: "span",
        attribs: { class: "anchor" },
      })
    : (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
        },
      });

  return sanitize(html, {
    allowedTags: ["span", "a", "b", "i"],
    allowedAttributes: {
      a: ["href", "target"],
      span: ["class"],
    },
    allowedSchemes: ["http", "https"],
    transformTags: {
      a: transformAnchor,
    },
  });
};
