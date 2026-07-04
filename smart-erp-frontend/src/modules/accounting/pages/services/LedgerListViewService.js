import { useState, useEffect } from 'react';
import { fetchLedgersList, fetchGroupsList, deleteLedgerApi } from '@modules/accounting/services/accounting.service';

export function useLedgerListViewData() {
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [balanceType, setBalanceType] = useState('');
  const [gstApplicable, setGstApplicable] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadLedgers = async () => {
    const params = {
      page, size: 10, search: search || null,
      groupId: groupId || null,
      isActive: isActive !== '' ? isActive === 'true' : null,
      balanceType: balanceType || null,
      gstApplicable: gstApplicable !== '' ? gstApplicable === 'true' : null
    };
    const res = await fetchLedgersList(params);
    setLedgers(res.data?.content || []);
    setTotalPages(res.data?.totalPages || 0);
  };

  useEffect(() => {
    loadLedgers();
  }, [page, groupId, isActive, balanceType, gstApplicable]);

  useEffect(() => {
    fetchGroupsList().then(res => setGroups(res.data || []));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ledger?')) {
      await deleteLedgerApi(id);
      loadLedgers();
    }
  };

  return {
    ledgers,
    groups,
    search,
    setSearch,
    groupId,
    setGroupId,
    isActive,
    setIsActive,
    balanceType,
    setBalanceType,
    gstApplicable,
    setGstApplicable,
    page,
    setPage,
    totalPages,
    loadLedgers,
    handleDelete
  };
}
