import {
  isBefore,
  endOfYesterday,
  formatDistance,
  format,
  isSameYear,
} from "date-fns";
import { ru as locale } from "date-fns/locale";
import { memo, useMemo } from "react";

import { formatDistanceShort } from "../../utilities";

type Props = {
  date: Date;
  isCompact?: boolean;
};

export const RelativeDate = memo<Props>(function RelativeDate({
  date,
  isCompact = false,
}) {
  const relativeDate = useMemo(() => {
    const now = new Date();

    if (isBefore(date, endOfYesterday())) {
      const fmt = isSameYear(now, date) ? "d MMM" : "d MMM yy";
      return format(date, fmt, { locale });
    }

    if (isCompact) {
      return formatDistanceShort(date, now);
    }

    return formatDistance(date, now, { locale, addSuffix: true });
  }, [date, isCompact]);

  return (
    <time dateTime={date.toISOString()} title={date.toLocaleString()}>
      {relativeDate}
    </time>
  );
});
