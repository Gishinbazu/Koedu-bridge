export const getPagination = (page?: string, limit?: string) => {
  const p = Math.max(parseInt(page || "1", 10), 1);
  const l = Math.max(parseInt(limit || "20", 10), 1);
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
};
