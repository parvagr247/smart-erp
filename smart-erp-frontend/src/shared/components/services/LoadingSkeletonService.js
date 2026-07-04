export function useLoadingSkeletonData({ rows = 3 }) {
  const items = Array.from({ length: rows });
  return { items };
}
