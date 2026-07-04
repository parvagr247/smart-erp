import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLedgerById } from '@modules/accounting/services/accounting.service';

export function useLedgerDetailsViewData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchLedgerById(id)
      .then(res => {
        setLedger(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return {
    navigate,
    ledger,
    loading,
    copiedField,
    copyToClipboard
  };
}
