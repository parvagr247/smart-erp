export function useSearchBarData({ onChange }) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return { handleChange };
}
