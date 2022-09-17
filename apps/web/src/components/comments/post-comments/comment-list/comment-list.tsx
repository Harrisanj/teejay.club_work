import { observer } from "mobx-react-lite";
import { useState } from "react";

import { Comment } from "../comment";
import { TComment } from "../type";

type Props = {
  comments: Array<TComment>;
  level?: number;
  replyTo?: number;
  onReplyToChange: (replyTo?: number) => void;
};

export const CommentList = observer<Props>(
  ({ comments, level = 1, replyTo, onReplyToChange }) => {
    const [isMinimazed, setIsMinimazed] = useState(false);

    return (
      <div className="relative">
        {level > 1 && level <= 7 && !isMinimazed && (
          <button
            className={
              "group absolute inset-y-0 -left-2 w-4 flex justify-center cursor-pointer z-10"
            }
            onClick={() => setIsMinimazed(true)}
          >
            <div className="w-[1px] h-full bg-gray-300 group-hover:bg-gray-500 transition-colors duration-300"></div>
          </button>
        )}
        {isMinimazed ? (
          <div>
            <button
              className="text-sm text-blue-500"
              onClick={() => setIsMinimazed(false)}
            >
              Ещё комментарии
            </button>
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              level={level}
              replyTo={replyTo}
              onReplyToChange={onReplyToChange}
            />
          ))
        )}
      </div>
    );
  }
);

CommentList.displayName = "CommentList";
