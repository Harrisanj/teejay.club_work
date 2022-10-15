import { stat } from "fs";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { memo, useState } from "react";

import { classNames, getImageUrl } from "../../../../utilities";
import { Dropper } from "../../../dropper";
import { Spinner } from "../../../spinner";
import { TextArea } from "../../../text-area";

import { useEditCommentState } from "./edit-comment-form.state";

export type Props = {
  id?: number;
  text?: string;
  imageId?: string;
  postId: number;
  parentId?: number;
  level?: number;
  onCancel?: () => void;
  onSubmit?: () => void;
};

export const EditCommentForm = memo<Props>((props) => {
  const state = useEditCommentState(props);
  const { level = 0 } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);
  return (
    <div
      className="relative flex flex-col"
      style={{ marginLeft: level > 0 && level < 7 ? "1rem" : "" }}
    >
      {level > 0 && (
        <div>
          <div className="absolute -left-4 w-3 top-6 h-[1px] bg-gray-300" />
          <button className="absolute inset-y-0 -left-6 w-4 flex justify-center z-10">
            <div className="w-[1px] h-full bg-gray-300"></div>
          </button>
        </div>
      )}
      <Dropper onFileChange={state.handleImageChange}>
        {({ isDragging, isDropping, openFileDialog }) => (
          <form
            className={classNames(
              "relative mt-2 p-3 flex flex-col gap-y-3 border",
              "bg-gray-50 border-gray-100 rounded transition-shadow duration-300",
              {
                "!border-gray-200 shadow-inner": isFocused,
                "ring-1 ring-red-500": (state.text ?? "").trim().length > 2048,
                "outline-dashed outline-offset-2 outline-2 outline-gray-300":
                  isDragging,
                "outline-dashed outline-offset-2 outline-2 outline-blue-500":
                  isDropping,
              }
            )}
            onSubmit={state.handleSubmit}
          >
            <Spinner isSpinning={state.isLoading} />
            <TextArea
              className="min-h-[24px] resize-none bg-transparent outline-none transition-all duration-100"
              placeholder={state.isEditing ? "" : "Написать комментарий..."}
              value={state.text ?? ""}
              onChange={state.handleTextChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {"text" in state.errors && (
              <div className="text-red-500">{state.errors["text"]}</div>
            )}
            {state.imageId && (
              <div className="flex flex-row">
                <div className="relative">
                  <button
                    type="button"
                    className={classNames(
                      "group p-0.5",
                      "absolute -top-2 -right-2 rounded-full bg-white shadow cursor-pointer",
                      "hover:shadow-md",
                      "transition-shadow duration-300"
                    )}
                    onClick={() => state.handleImageRemove()}
                  >
                    <XMarkIcon className="w-4 h-4 stroke-2 group-hover:stroke-red-500 transition-colors duration-300" />
                  </button>
                  <img
                    className="rounded-md max-w-[400px] max-h-[300px]"
                    src={getImageUrl(state.imageId)}
                    alt="Изображение к комментарию"
                  />
                </div>
              </div>
            )}
            <div
              className={classNames({
                "flex flex-row flex-wrap items-center justify-between": true,
              })}
            >
              <button
                type="button"
                className="group p-1 flex flex-row cursor-pointer"
                onClick={() => openFileDialog()}
              >
                <PhotoIcon className="w-5 h-5 group-hover:stroke-blue-600 stroke-2 transition-colors duration-300" />
              </button>
              <div className="flex flex-row gap-x-1">
                {props.onCancel && (
                  <button
                    type="button"
                    onClick={props.onCancel}
                    className="px-3 py-1 text-gray-500 hover:text-gray-700 transition-all duration-300"
                  >
                    Отмена
                  </button>
                )}
                <button
                  className={classNames({
                    "bg-blue-300 shadow-none": state.isSubmitDisabled,
                    "px-3 py-1 bg-blue-500 text-white rounded shadow cursor-pointer transition-all duration-300":
                      true,
                  })}
                  disabled={state.isSubmitDisabled}
                  type="submit"
                >
                  {state.isEditing ? "Сохранить" : "Отправить"}
                </button>
              </div>
            </div>
          </form>
        )}
      </Dropper>
    </div>
  );
});

EditCommentForm.displayName = "EditCommentForm";
