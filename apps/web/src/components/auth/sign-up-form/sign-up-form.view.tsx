import { TInvite } from "@teejay/api";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useState } from "react";

import { useClientSideTRPC } from "../../../utilities";
import { Field, Form, Input } from "../../form";
import { Link } from "../../link";
import { Spinner } from "../../spinner";

import { SignUpFormState } from "./sign-up-form.state";

type Props = {
  invite?: TInvite;
};

export const SignUpForm = observer<Props>(({ invite }) => {
  const trpcClient = useClientSideTRPC();
  const router = useRouter();
  const [state] = useState(
    () => new SignUpFormState(trpcClient, router, invite)
  );
  const title = invite ? "Пришлашение в клуб" : "Регистрация в клубе";
  if (state.signUpTask.isSucceeded) {
    return (
      <Form title={title}>
        <div className="border-l-8 border-green-500 bg-green-50 text-green-900 -mx-4 px-4 py-4 flex flex-col gap-y-3">
          <p>Вы успешно вступили в клуб TeeJay.</p>
          <p>
            Теперь вы можете <Link href="/sign-in">войти</Link> на сайт.
          </p>
        </div>
      </Form>
    );
  }

  return (
    <Form title={title} onSubmit={state.handleSubmit}>
      <Spinner isSpinning={state.signUpTask.isRunning} />
      {invite && (
        <p className="">
          {invite.inviter.name} приглашает вас присоединится к клубу TeeJay!
        </p>
      )}
      <p>Введите данные, которые будут использоваться для входа на сайт.</p>
      {state.signUpTask.isFaulted && (
        <div className="text-red-500">Логин уже занят кем-то другим</div>
      )}
      <Field label="Логин" isRequired errors={state.errors["login"]}>
        <Input
          placeholder="Введите логин"
          type="text"
          name="login"
          value={state.login}
          onChange={state.handleLoginChange}
        />
        <div className="text-gray-400">
          Будет использоваться для входа на сайт
        </div>
      </Field>
      <Field label="Эл. адрес" errors={state.errors["email"]}>
        <Input
          placeholder="Введите эл. адрес"
          type="text"
          name="email"
          value={state.email}
          onChange={state.handleEmailChange}
        />
        <div className="text-gray-400">
          Может пригодиться для восстановления пароля
        </div>
      </Field>
      <Field label="Имя" errors={state.errors["name"]}>
        <Input
          placeholder="Введите имя"
          type="text"
          name="name"
          value={state.name}
          onChange={state.handleNameChange}
        />
        <div className="text-gray-400">
          Под этим именем вас будут знать на сайте
        </div>
      </Field>
      <Field label="Пароль" isRequired errors={state.errors["password"]}>
        <Input
          placeholder="Введите пароль"
          type="password"
          name="password"
          value={state.password}
          onChange={state.handlePasswordChange}
        />
        <div className="text-gray-400">Чем сложнее, тем лучше</div>
      </Field>
      <div className="flex flex-row justify-end">
        <button
          type="submit"
          className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer"
        >
          Зарегистрироваться
        </button>
      </div>
    </Form>
  );
});
