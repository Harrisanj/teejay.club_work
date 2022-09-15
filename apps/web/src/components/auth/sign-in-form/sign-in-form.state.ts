import { signInInput, InputError } from "@teejay/api";
import { makeAutoObservable } from "mobx";
import { NextRouter } from "next/router";
import { ChangeEvent, FormEvent } from "react";

import { Task, transformInputError, ClientSideTRPC } from "../../../utilities";

export class SignInFormState {
  constructor(
    public readonly trpcClient: ClientSideTRPC,
    public readonly router: NextRouter
  ) {
    makeAutoObservable(this, { trpcClient: false }, { autoBind: true });
  }

  private _login = "";

  get login() {
    return this._login;
  }

  handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    this._login = event.target.value;
  };

  private _password = "";

  get password() {
    return this._password;
  }

  handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this._password = event.target.value;
  };

  private _errors: Record<string, string[]> = {};

  get errors() {
    return this._errors;
  }

  private set errors(value: Record<string, string[]>) {
    this._errors = value;
  }

  signInTask = new Task(async () => {
    this.errors = {};

    try {
      const input = await signInInput.parseAsync({
        login: this.login.toLowerCase().trim(),
        password: this.password,
      });

      const accessToken = await this.trpcClient.auth.signIn.mutate(input);

      const sevenDays = 60 * 60 * 24 * 7;
      document.cookie = `accessToken=${accessToken}; Path=/; Max-Age=${sevenDays}; SameSite=Strict`;

      await this.router.replace("/");
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

    await this.signInTask.run();
  };
}
