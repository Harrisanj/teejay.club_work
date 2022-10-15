export const getImageUrl = (uuid: string | null) => {
  const host = process.env.NEXT_PUBLIC_API_HOSTNAME ?? "";
  return `${host}/images/${uuid ?? "default"}`;
};

export const getAvatarUrl = (uuid: string | null) => {
  const host = process.env.NEXT_PUBLIC_API_HOSTNAME ?? "";
  return `${host}/avatars/${uuid ?? "default"}`;
};

export const getEmbedUrl = (uuid: string | null) => {
  const host = process.env.NEXT_PUBLIC_API_HOSTNAME ?? "";
  return `${host}/embeds/${uuid ?? "default"}`;
};
