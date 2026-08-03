import React from 'react';
import { X, FolderKanban } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function PlanSelectorModal({ isOpen, onClose }) {
  const plans = useStore(state => state.plans || []);
  const activePlanId = useStore(state => state.activePlanId);
  const switchPlan = useStore(state => state.switchPlan);

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
          backdropFilter: 'blur(2px)'
        }}
        onClick={onClose}
      />
      <div 
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1000,
          width: '90%',
          maxWidth: '500px',
          padding: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderKanban size={24} style={{ color: 'var(--primary-color)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Saved Plans</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {plans.map((plan) => {
            const isSelected = plan.id === activePlanId;
            // Get root page or first page to show its description
            const rootPage = plan.pages?.find(p => p.parentId === null) || plan.pages?.[0];
            const description = rootPage?.description || 'No description available.';

            return (
              <button
                key={plan.id}
                onClick={() => {
                  switchPlan(plan.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-color)',
                  border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {plan.name} {plan.isDemo && '(Demo)'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {plan.updatedAt && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Updated {new Date(plan.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    {isSelected && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-color)', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
