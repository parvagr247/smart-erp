import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { fetchPurchaseById, updatePurchaseApi } from '../services/purchase.service';
import PurchaseForm from '../components/PurchaseForm';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';

export default function EditPurchaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();
  
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const res = await fetchPurchaseById(id);
        if (res.success && res.data) {
          if (res.data.status !== 'DRAFT') {
            setError('Only DRAFT purchases can be edited.');
          }
          setPurchase(res.data);
        } else {
          setError(res.message || 'Failed to fetch purchase details.');
        }
      } catch (err) {
        console.error(err);
        setError('Server error occurred while loading purchase.');
      } finally {
        setLoading(false);
      }
    };
    loadPurchase();
  }, [id]);

  const handleSave = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await updatePurchaseApi(id, data);
      if (res.success) {
        navigate(`/inventory/purchases/${id}`);
      } else {
        setError(res.message || 'Failed to save changes.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Edit Purchase Draft"
        subtitle="Modify details of your saved purchase draft before posting."
      />

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg mb-4 text-left">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {loading && (
        <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">
          Loading purchase data...
        </div>
      )}

      {!loading && !error && purchase && (
        submitting ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">
            Saving purchase transaction... Please wait.
          </div>
        ) : (
          <PurchaseForm
            initialData={purchase}
            onSave={handleSave}
            onCancel={() => navigate(`/inventory/purchases/${id}`)}
            companyState={activeCompany ? activeCompany.state : ''}
          />
        )
      )}
    </PageContainer>
  );
}
