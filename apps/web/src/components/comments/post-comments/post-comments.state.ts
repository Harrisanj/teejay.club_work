import { TComment } from "@teejay/api";
import { max } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";

import { ClientSideTRPC, Task } from "../../../utilities";

type Node = TComment & { children: Node[] };

export class PostCommentsState {
  constructor(
    public readonly trpc: ClientSideTRPC,
    public readonly postId: number
  ) {
    makeAutoObservable(this, { trpc: false }, { autoBind: true });
  }

  private _intervalId = -1;

  onMount() {
    this.fetch();

    this._intervalId = window.setInterval(this.fetch, 1000);
  }

  onUnmount() {
    this._fetchTask.reset();

    window.clearTimeout(this._intervalId);
  }

  private _fetchTask = new Task(async () => {
    const result = await this.trpc.comments.getByPost.query({
      postId: this.postId,
      lastUpdatedAt: this._lastUpdatedAt,
    });

    runInAction(() => {
      result.data.forEach((comment) => {
        this._map[comment.id] = comment;
        this._lastUpdatedAt = max([this._lastUpdatedAt, comment.updatedAt]);
      });

      this._total = result.meta.total;
      this._isLoading = false;
    });
  });

  fetch() {
    this._fetchTask.run();
  }

  private _lastUpdatedAt: Date = new Date(0);

  private _total = 0;

  get total() {
    return this._total;
  }

  private _isLoading = true;

  get isLoading() {
    return this._isLoading;
  }

  private _map: Record<number, TComment> = {};

  get tree(): Node[] {
    const map: Record<number, Node> = Object.fromEntries(
      Object.entries(this._map).map(([id, comment]) => [
        id,
        { ...comment, children: [] },
      ])
    );
    const root: Node[] = [];

    Object.values(map).forEach((node) => {
      if (node.parentId) {
        map[node.parentId].children.push(node);
      } else {
        root.push(node);
      }
    });

    return root;
  }

  private _replyTo: number | null = null;

  get replyTo() {
    return this._replyTo;
  }

  set replyTo(value: number | null) {
    this._replyTo = value;
  }
}
