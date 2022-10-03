import {
  updateCommentInput,
  createCommentInput,
  InputError,
} from "@teejay/api";
import { useRouter } from "next/router";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

import { trpc, transformInputError } from "../../../../utilities";

import { Props } from "./edit-comment-form.view";

export type EditCommentState = ReturnType<typeof useEditCommentState>;

export function useEditCommentState({
  id,
  text: initialText,
  postId,
  parentId,
  onSubmit,
}: Props) {
  const router = useRouter();

  const [text, setText] = useState(initialText ?? "");
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const [errors, setErrors] = useState({} as Record<string, string[]>);

  const updateMutation = trpc.comments.update.useMutation();
  const createMutation = trpc.comments.create.useMutation();

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const isEditing = !!id;

  const isSubmitDisabled = text.trim().length < 1;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (id) {
        const input = updateCommentInput.parse({
          id,
          content: text.trim(),
        });
        updateMutation.mutate(input);
      } else {
        const input = createCommentInput.parse({
          postId,
          parentId,
          content: text.trim(),
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

  useEffect(() => {
    const comment = createMutation.data || updateMutation.data;
    if (!comment) {
      return;
    }
    onSubmit?.();
    setText("");

    router.push({ query: { id: postId, comment: comment.id } }, undefined, {
      shallow: true,
      scroll: false,
    });
  }, [updateMutation.data, createMutation.data, onSubmit, router, postId]);

  return {
    text,
    handleTextChange,
    handleSubmit,
    errors,
    isLoading,
    isEditing,
    isSubmitDisabled,
  };
}
