export function useStatCardData({ trend }) {
  const isPositive = trend?.isPositive;
  const trendClass = isPositive ? 'text-green-500' : 'text-red-500';

  return { isPositive, trendClass };
}
