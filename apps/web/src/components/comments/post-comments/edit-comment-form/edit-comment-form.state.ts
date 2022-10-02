import {
  createCommentInput,
  InputError,
  updateCommentInput,
} from "@teejay/api";
import { makeAutoObservable } from "mobx";
import { NextRouter } from "next/router";
import { ChangeEvent, FormEvent } from "react";

import {
  Task,
  ClientSideTRPC,
  transformInputError,
} from "../../../../utilities";

import { Props } from "./edit-comment-form.view";

class EditCommentFormState {
  constructor(
    public readonly trpc: ClientSideTRPC,
    public readonly router: NextRouter
  ) {
    makeAutoObservable(this, { trpc: false }, { autoBind: true });
  }

  private postId: number | undefined = undefined;
  private parentId: number | undefined = undefined;
  private onSubmit: (() => void) | undefined = undefined;

  onUpdate({ id, text, postId, parentId, onSubmit }: Props) {
    this.id = id;
    this.text = text ?? "";
    this.postId = postId;
    this.parentId = parentId;
    this.onSubmit = onSubmit;
  }

  private _id?: number = undefined;

  get id() {
    return this._id;
  }

  private set id(value: number | undefined) {
    this._id = value;
  }

  private _text = "";

  get text() {
    return this._text;
  }

  private set text(value: string) {
    this._text = value;
  }

  handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    this._text = event.target.value;
  };

  get isSubmitButtonDisabled() {
    return this.text.length < 3;
  }

  private _errors: Record<string, string[]> = {};

  get errors() {
    return this._errors;
  }

  private setErrors(value: Record<string, string[]>) {
    this._errors = value;
  }

  get isEditing() {
    return this.id !== undefined;
  }

  submitTask = new Task(async () => {
    try {
      let comment;
      if (this.id) {
        const input = updateCommentInput.parse({
          id: this.id,
          content: this.text.trim(),
        });
        comment = await this.trpc.comments.update.mutate(input);
      } else {
        const input = createCommentInput.parse({
          postId: this.postId,
          parentId: this.parentId,
          content: this.text.trim(),
        });
        comment = await this.trpc.comments.create.mutate(input);
      }

      this.onSubmit?.();

      this.text = "";
      this.submitTask.reset();
      this.router.push(
        { query: { id: this.postId, comment: comment.id } },
        undefined,
        { scroll: false }
      );
    } catch (error) {
      console.log(error);
      if (error instanceof InputError) {
        this.setErrors(transformInputError(error));
      } else {
        throw error;
      }
    }
  });

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    return this.submitTask.run();
  };
}

export default EditCommentFormState;
