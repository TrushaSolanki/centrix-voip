// query params to string

export const paramsToQueryString = (params: any) => {
  const filteredParams = Object.keys(params).filter(
    (key) =>
      params[key] !== undefined && params[key] !== null && params[key] !== ""
  );

  if (filteredParams.length === 0) {
    return "";
  }

  return (
    "?" +
    filteredParams
      .map((key) => {
        if (key === "StartDate" || key === "EndDate") {
          return `${key}=${params[key]}`;
        }
        return `${key}=${encodeURIComponent(params[key]!.toString())}`;
      })
      .join("&")
  );
};

export const formatToISOWithoutTimezoneShift = (date: Date | null) => {
  if (!date) return null;

  // Get the local timezone offset in minutes and adjust
  const localOffset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - localOffset * 60000);

  return adjustedDate.toISOString(); // Ensures "YYYY-MM-DDTHH:mm:ss.sssZ" format
};
