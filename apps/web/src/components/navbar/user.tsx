import { memo } from "react";

import { getAvatarUrl, trpc } from "../../utilities";
import { Link } from "../link";

export const User = memo(() => {
  const { data: user } = trpc.users.getMe.useQuery();

  if (!user) {
    return null;
  }

  return (
    <Link href={`/users/${user.id}`}>
      <img
        className="w-8 h-8 rounded"
        width={32}
        height={32}
        alt={user.name}
        src={getAvatarUrl(user.avatarId)}
      />
    </Link>
  );
});

User.displayName = "User";
