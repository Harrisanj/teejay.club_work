import { max } from "date-fns";
import { useState, useMemo, useEffect } from "react";

import { trpc } from "../../../utilities";

import { useScrollToComment } from "./hooks";
import { Props } from "./post-comments.view";
import { TComment } from "./type";

export type PostCommentsState = ReturnType<typeof usePostCommentsState>;

export function usePostCommentsState({ postId }: Props) {
  const [comments, setComments] = useState([] as Omit<TComment, "children">[]);
  const [total, setTotal] = useState(0);
  const [replyTo, setReplyTo] = useState<number>();

  const lastUpdatedAt = useLastUpdatedAt(comments);
  const tree = useCommentTree(comments);

  const query = trpc.comments.getByPost.useQuery(
    { postId, lastUpdatedAt },
    {
      refetchInterval: 1000,
      onSuccess(data) {
        setTotal(data.meta.total);
        setComments([...comments, ...data.data]);
      },
    }
  );

  useEffect(() => {
    setComments([]);
    query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useScrollToComment();

  return {
    isLoading: query.isLoading && !comments.length,
    refetch: query.refetch,
    tree,
    total,
    replyTo,
    setReplyTo,
  };
}

function useLastUpdatedAt(comments: Omit<TComment, "children">[]) {
  return useMemo(() => {
    let lastUpdatedAt = new Date(0);
    comments.forEach((comment) => {
      lastUpdatedAt = max([lastUpdatedAt, comment.updatedAt]);
    });
    return lastUpdatedAt;
  }, [comments]);
}

function useCommentTree(comments: Omit<TComment, "children">[]) {
  return useMemo(() => {
    const map: Record<number, TComment> = Object.fromEntries(
      comments.map((comment) => [
        comment.id,
        {
          ...comment,
          children: [],
        },
      ])
    );

    const root: Array<TComment> = [];

    Object.values(map).forEach((node) => {
      if (node.parentId) {
        map[node.parentId].children.push(node);
      } else {
        root.push(node);
      }
    });

    return root;
  }, [comments]);
}
