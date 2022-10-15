import {
  updateCommentInput,
  createCommentInput,
  InputError,
} from "@teejay/api";
import { useRouter } from "next/router";
import { useState, ChangeEvent, FormEvent, useEffect, useMemo } from "react";

import {
  trpc,
  transformInputError,
  extractAccessToken,
} from "../../../../utilities";
import { TComment } from "../type";

import { Props } from "./edit-comment-form.view";

export type EditCommentState = ReturnType<typeof useEditCommentState>;

export function useEditCommentState({
  id,
  text: initialText,
  imageId: initialImageId,
  postId,
  parentId,
  onSubmit,
}: Props) {
  const router = useRouter();

  const [text, setText] = useState(initialText);
  const [imageId, setImageId] = useState(initialImageId);

  const [errors, setErrors] = useState({} as Record<string, string[]>);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  const handleImageChange = async (file: File) => {
    setIsImageLoading(true);

    const body = new FormData();
    body.set("file", file);
    const accessToken = extractAccessToken(document.cookie);
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_HOSTNAME ?? "") + "/images",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      }
    );

    if (response.status !== 200) {
      setIsImageLoading(false);
      setErrors({
        image: ["Ошибка при загрузке изображения"],
      });
      return;
    }

    const { id } = await response.json();
    setImageId(id);
    setIsImageLoading(false);
  };

  const handleImageRemove = () => {
    setImageId(undefined);
  };

  const handleSuccess = async (comment: { id: number }) => {
    await onSubmit?.();
    setText(undefined);
    setImageId(undefined);

    if (!isEditing) {
      router.push({ query: { id: postId, comment: comment.id } }, undefined, {
        shallow: true,
        scroll: false,
      });
    }
  };

  const updateMutation = trpc.comments.update.useMutation({
    onSuccess: handleSuccess,
  });
  const createMutation = trpc.comments.create.useMutation({
    onSuccess: handleSuccess,
  });

  const isLoading =
    createMutation.isLoading || updateMutation.isLoading || isImageLoading;

  const isEditing = !!id;

  const isSubmitDisabled = useMemo(() => {
    if (isEditing) {
      const input = { id, text, imageId };
      return !updateCommentInput.safeParse(input).success;
    } else {
      const input = { postId, parentId, text, imageId };
      return !createCommentInput.safeParse(input).success;
    }
  }, [id, imageId, isEditing, parentId, postId, text]);

  const updateComment = async () => {
    try {
      if (id) {
        const input = updateCommentInput.parse({
          id,
          text,
          imageId,
        });
        updateMutation.mutate(input);
      } else {
        const input = createCommentInput.parse({
          postId,
          parentId,
          text,
          imageId,
        });
        createMutation.mutate(input);
      }
    } catch (error) {
      if (error instanceof InputError) {
        setErrors(transformInputError(error));
      } else {
        throw error;
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await updateComment();
  };

  return {
    text,
    imageId,
    handleTextChange,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
    errors,
    isLoading,
    isEditing,
    isSubmitDisabled,
  };
}
