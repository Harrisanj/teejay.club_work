import { memo, useState } from "react";

import { classNames } from "../../../../utilities";
import { Spinner } from "../../../spinner";
import { TextArea } from "../../../text-area";

import { useEditCommentState } from "./edit-comment-form.state";

export type Props = {
  id?: number;
  text?: string;
  postId: number;
  parentId?: number;
  level?: number;
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
      <form
        className={classNames(
          "relative mt-2 p-3 flex flex-col gap-y-3 border",
          "bg-gray-50 border-gray-100 rounded transition-all duration-300",
          {
            "!border-gray-200 shadow-inner": isFocused,
            "ring-1 ring-red-500": state.text.trim().length > 2048,
          }
        )}
        onSubmit={state.handleSubmit}
      >
        <Spinner isSpinning={state.isLoading} />
        <TextArea
          className="min-h-[24px] resize-none bg-transparent outline-none transition-all duration-100"
          placeholder={state.isEditing ? "" : "Написать комментарий..."}
          value={state.text}
          onChange={state.handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div
          className={classNames({
            "opacity-0": !state.text.length,
            "flex flex-row flex-wrap justify-between": true,
          })}
        >
          {"text" in state.errors && (
            <div className="text-red-500">{state.errors["text"]}</div>
          )}
          <button
            className={classNames({
              "bg-blue-300 cursor-default shadow-none": state.isSubmitDisabled,
              "ml-auto px-3 py-1 bg-blue-500 text-white rounded shadow cursor-pointer transition-all duration-300":
                true,
            })}
            type="submit"
          >
            {state.isEditing ? "Сохранить" : "Отправить"}
          </button>
        </div>
      </form>
    </div>
  );
});

EditCommentForm.displayName = "EditCommentForm";
