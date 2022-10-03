import { trpc } from "../../../utilities";

import { Props } from "./comment-vote.view";

export type CommentVoteState = ReturnType<typeof useCommentVoteState>;

export function useCommentVoteState({ comment }: Props) {
  const context = trpc.useContext();

  const { data: user } = trpc.users.getMe.useQuery();
  const { mutate } = trpc.comments.vote.useMutation({
    onSuccess() {
      context.comments.getByPost.invalidate();
    },
  });

  const isUserLoggedIn = !!user;
  const isClickable = isUserLoggedIn && comment.author.id !== user.id;

  const handleDownvoteClick = () => {
    if (!isClickable) {
      return;
    }
    mutate({ commentId: comment.id, sign: -1 });
  };

  const handleUpvoteClick = () => {
    if (!isClickable) {
      return;
    }
    mutate({ commentId: comment.id, sign: 1 });
  };

  return {
    comment,
    isUserLoggedIn,
    isClickable,
    handleDownvoteClick,
    handleUpvoteClick,
  };
}
