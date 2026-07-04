export function useDataTableData() {
  const getRowKey = (row, idx) => {
    return row.id || idx;
  };

  return { getRowKey };
}
