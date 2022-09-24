import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { AppRouter } from "@teejay/api";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

import {
  classNames,
  trpc,
  useClientSideTRPC,
  getAvatarUrl,
} from "../../../utilities";
import { Renderer } from "../../renderer";
import { Spinner } from "../../spinner";

import { EditPostFormState } from "./edit-post-form.state";

const Editor = dynamic(() => import("../../editor").then((i) => i.Editor));

type Props = {
  post?: AppRouter["posts"]["getOne"]["_def"]["_output_out"];
};

export const EditPostForm = observer<Props>(({ post }) => {
  const clientSideTRPC = useClientSideTRPC();
  const router = useRouter();
  const [state] = useState(
    () => new EditPostFormState(clientSideTRPC, router, post)
  );

  const userQuery = trpc.users.getMe.useQuery();
  const subsitesQuery = trpc.subsites.getAll.useQuery();

  const subsites = subsitesQuery.data;
  const user = userQuery.data;

  if (!user || !subsites) {
    return null;
  }

  return (
    <div className="relative flex flex-col gap-y-3">
      <Spinner
        isSpinning={subsitesQuery.isFetching || state.submitTask.isRunning}
      />
      <div className="ce-block">
        <div className="ce-block__content">
          <div className="flex -my-2 flex-row justify-between">
            <Listbox
              as="div"
              className="relative"
              value={state.subsite}
              onChange={state.setSubsite}
            >
              <Listbox.Button
                className={classNames(
                  "flex flex-row gap-x-2 items-center py-2 text-sm rounded",
                  "text-gray-900 transition-colors duration-300  cursor-pointer"
                )}
              >
                <img
                  alt={state.subsite?.name ?? "Мой блог"}
                  className="w-6 h-6 rounded"
                  width={24}
                  height={24}
                  src={state.subsite?.avatar ?? getAvatarUrl(user.avatarId)}
                />
                {state.subsite?.name ?? "Мой блог"}
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Listbox.Options
                  className={classNames(
                    "absolute -left-4 origin-top-left mt-2 w-56 max-h-56 z-10",
                    "bg-white shadow-lg ring-1 ring-amber-500 ring-opacity-50 rounded-md",
                    "overflow-auto focus:outline-none"
                  )}
                >
                  <Listbox.Option value={undefined}>
                    <div
                      className={classNames(
                        "flex flex-row gap-x-2 items-center px-4 py-2 text-sm whitespace-nowrap",
                        "text-gray-900 hover:bg-gray-100 cursor-pointer"
                      )}
                    >
                      <img
                        className="w-6 h-6 rounded"
                        width={24}
                        height={24}
                        src={getAvatarUrl(user.avatarId)}
                        alt={user.name}
                      />
                      Мой блог
                    </div>
                  </Listbox.Option>
                  <hr />
                  {subsites.map((subsite) => (
                    <Listbox.Option key={subsite.id} value={subsite}>
                      <div
                        className={classNames(
                          "flex flex-row gap-x-2 items-center px-4 py-2 text-sm whitespace-nowrap",
                          "text-gray-900 hover:bg-gray-100 cursor-pointer"
                        )}
                      >
                        <Image
                          className="w-6 h-6 rounded"
                          width={24}
                          height={24}
                          src={subsite.avatar}
                          alt={subsite.name}
                        />
                        {subsite.name}
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        </div>
      </div>
      <form
        className="content flex flex-col gap-y-3"
        onSubmit={state.handleSubmit}
      >
        {state.submitTask.isFaulted && (
          <div className="text-red-500">{state.submitTask.error.message}</div>
        )}
        <div className="ce-block">
          <div className="ce-block__content">
            <input
              id="title-input"
              className="w-full font-bold text-xl placeholder-gray-300 bg-transparent outline-none"
              placeholder="Заголовок"
              type="text"
              value={state.title ?? ""}
              onChange={state.handleTitleChange}
              disabled={state.isPreview}
            />
          </div>
        </div>
        {"title" in state.errors && (
          <div className="text-red-500">{state.errors["title"]}</div>
        )}
        {state.isPreview ? (
          <div className="ce-block">
            <div className="ce-block__content">
              <Renderer>{state.content}</Renderer>
            </div>
          </div>
        ) : (
          <Editor
            placeholder="Напишите что-нибудь..."
            value={state.content}
            onChange={state.setContent}
          />
        )}
        {"content" in state.errors && (
          <div className="text-red-500">{state.errors["content"]}</div>
        )}
        <div className="flex flex-row justify-end items-center flex-wrap gap-3 content">
          <button type="button" onClick={() => state.togglePreview()}>
            {state.isPreview ? (
              <PencilSquareIcon className="w-6 h-6 stroke-black" />
            ) : (
              <EyeIcon className="w-6 h-6 stroke-black" />
            )}
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer"
          >
            {state.isEditing ? "Сохранить" : "Опубликовать"}
          </button>
        </div>
      </form>
    </div>
  );
});
