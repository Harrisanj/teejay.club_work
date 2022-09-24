import { createCommentInput, InferInput, InputError } from "@teejay/api";
import { makeAutoObservable } from "mobx";
import { NextRouter } from "next/router";
import { ChangeEvent, FormEvent } from "react";

import {
  Task,
  ClientSideTRPC,
  transformInputError,
} from "../../../../utilities";

import { Props } from "./new-comment-form.view";

class NewCommentFormState {
  constructor(
    public readonly trpc: ClientSideTRPC,
    public readonly router: NextRouter
  ) {
    makeAutoObservable(this, { trpc: false }, { autoBind: true });
  }

  private postId: number | undefined = undefined;
  private parentId: number | undefined = undefined;
  private onCreate: (() => void) | undefined = undefined;

  onUpdate({ postId, parentId, onCreate }: Props) {
    this.postId = postId;
    this.parentId = parentId;
    this.onCreate = onCreate;
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

  createCommentTask = new Task(
    async (input: InferInput<typeof createCommentInput>) => {
      const comment = await this.trpc.comments.create.mutate(input);

      this.onCreate?.();

      this.text = "";
      this.createCommentTask.reset();
      this.router.push(
        { query: { id: this.postId, comment: comment.id } },
        undefined,
        { scroll: false }
      );
    }
  );

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const input = createCommentInput.parse({
        postId: this.postId,
        parentId: this.parentId,
        content: this.text.trim(),
      });
      await this.createCommentTask.run(input);
    } catch (error) {
      if (error instanceof InputError) {
        this.setErrors(transformInputError(error));
      } else {
        throw error;
      }
    }
  };
}

export default NewCommentFormState;
