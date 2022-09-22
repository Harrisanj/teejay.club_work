import { observer } from "mobx-react-lite";
import { useState } from "react";

import { Comment } from "../comment";
import { PostCommentsState } from "../post-comments.state";
import { TComment } from "../type";

type Props = {
  state: PostCommentsState;
  comments: Array<TComment>;
  level?: number;
};

export const CommentList = observer<Props>(({ state, comments, level = 1 }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  return (
    <div className="relative">
      {level > 1 && level <= 7 && !isMinimized && (
        <button
          className={
            "group absolute inset-y-0 -left-2 w-4 flex justify-center cursor-pointer z-10"
          }
          onClick={() => setIsMinimized(true)}
        >
          <div className="w-[1px] h-full bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
        </button>
      )}
      {isMinimized ? (
        <div>
          <button
            className="text-sm text-blue-500"
            onClick={() => setIsMinimized(false)}
          >
            Ещё комментарии
          </button>
        </div>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            state={state}
            comment={comment}
            level={level}
          />
        ))
      )}
    </div>
  );
});

CommentList.displayName = "CommentList";
