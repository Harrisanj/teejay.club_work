import { OutputData } from "@editorjs/editorjs";
import {
  AppRouter,
  createPostInput,
  InputError,
  TSubsite,
  updatePostInput,
} from "@teejay/api";
import { makeAutoObservable } from "mobx";
import { NextRouter } from "next/router";
import { ChangeEvent, FormEvent } from "react";

import { Task, transformInputError, ClientSideTRPC } from "../../../utilities";

export class EditPostFormState {
  constructor(
    public readonly trpc: ClientSideTRPC,
    private readonly router: NextRouter,
    private readonly post?: AppRouter["posts"]["getOne"]["_def"]["_output_out"]
  ) {
    makeAutoObservable(this, { trpc: false }, { autoBind: true });

    if (post) {
      this.setSubsite(post.subsite);
      this.setTitle(post.title);
      this.setContent(
        (post.contentV2 as unknown as OutputData) ?? { blocks: [] }
      );
    }
  }

  private _subsite: TSubsite | null = null;

  get subsite() {
    return this._subsite;
  }

  setSubsite(value: TSubsite | null) {
    this._subsite = value;
  }

  private _title: string | null = null;

  get title() {
    return this._title;
  }

  private setTitle(value: string | null) {
    this._title = value;
  }

  handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    this._title = event.target.value;
  };

  private _content: OutputData = { blocks: [] };

  get content() {
    return this._content;
  }

  setContent = (value: OutputData) => {
    this._content = value;
  };

  private _isPreview = false;

  get isPreview() {
    return this._isPreview;
  }

  togglePreview() {
    this._isPreview = !this._isPreview;
  }

  get isEditing() {
    return this.post !== undefined;
  }

  private _errors: Record<string, string[]> = {};

  get errors() {
    return this._errors;
  }

  private set errors(value: Record<string, string[]>) {
    this._errors = value;
  }

  submitTask = new Task(async () => {
    this.errors = {};

    const baseInput = {
      title: this.title,
      content: this.content,
      subsiteId: this.subsite?.id,
    };

    try {
      let post;

      if (this.post) {
        const input = updatePostInput.parse({
          id: this.post.id,
          ...baseInput,
        });
        post = await this.trpc.posts.update.mutate(input);
      } else {
        const input = createPostInput.parse(baseInput);
        post = await this.trpc.posts.create.mutate(input);
      }

      await this.router.push(`/posts/${post.id}`);
    } catch (error) {
      if (error instanceof InputError) {
        this.errors = transformInputError(error);
      } else {
        throw error;
      }
    }
  });

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await this.submitTask.run();
  };
}
