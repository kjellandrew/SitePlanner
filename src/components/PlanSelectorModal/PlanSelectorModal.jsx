import React, { useState } from 'react';
import { X, FolderKanban, Edit2, Trash2, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

export default function PlanSelectorModal({ isOpen, onClose }) {
  const plans = useStore(state => state.plans || []);
  const activePlanId = useStore(state => state.activePlanId);
  const switchPlan = useStore(state => state.switchPlan);
  const renamePlan = useStore(state => state.renamePlan);
  const deletePlan = useStore(state => state.deletePlan);
  const exportData = useStore(state => state.exportData);

  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingNameInput, setEditingNameInput] = useState('');
  const [planToDelete, setPlanToDelete] = useState(null);

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
            const rootPage = plan.pages?.find(p => p.parentId === null) || plan.pages?.[0];
            const description = rootPage?.description || 'No description available.';
            const isEditing = editingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px 16px',
                  backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-color)',
                  border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s ease',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: '8px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                      <input
                        type="text"
                        value={editingNameInput}
                        onChange={(e) => setEditingNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            renamePlan(plan.id, editingNameInput.trim());
                            setEditingPlanId(null);
                          }
                          if (e.key === 'Escape') setEditingPlanId(null);
                        }}
                        autoFocus
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--primary-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '4px 8px',
                          outline: 'none',
                          flex: 1
                        }}
                      />
                      <button
                        onClick={() => {
                          renamePlan(plan.id, editingNameInput.trim());
                          setEditingPlanId(null);
                        }}
                        style={{ padding: '6px', color: 'var(--primary-color)' }}
                        title="Save Name"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        switchPlan(plan.id);
                        onClose();
                      }}
                      style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {plan.name} {plan.isDemo && '(Demo)'}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-color)', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                          Active
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {!plan.isDemo && !isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlanId(plan.id);
                          setEditingNameInput(plan.name || '');
                        }}
                        style={{ padding: '6px', color: 'var(--text-secondary)' }}
                        title="Rename Plan"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}

                    {plans.length > 1 && !plan.isDemo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlanToDelete(plan.id);
                        }}
                        style={{ padding: '6px', color: 'var(--danger-color)' }}
                        title="Delete Plan"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div 
                  onClick={() => {
                    switchPlan(plan.id);
                    onClose();
                  }}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
                >
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', flex: 1 }}>
                    {description}
                  </span>
                  {plan.updatedAt && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: '12px', flexShrink: 0 }}>
                      {new Date(plan.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!planToDelete}
        onClose={() => setPlanToDelete(null)}
        onConfirm={() => {
          if (planToDelete) deletePlan(planToDelete);
        }}
        title="Delete Plan?"
        isDanger={true}
        confirmText="Delete Plan"
        message="Are you sure you want to delete this plan? This action is permanent and cannot be undone."
      >
        <div style={{ marginTop: '12px' }}>
          We strongly recommend downloading a backup first. <br/>
          <button 
            onClick={(e) => {
              e.preventDefault();
              exportData();
            }} 
            style={{ 
              color: 'var(--primary-color)', 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              textDecoration: 'underline', 
              cursor: 'pointer',
              fontSize: '0.9375rem'
            }}
          >
            Click here to download your data as a JSON file.
          </button>
        </div>
      </ConfirmModal>
    </>
  );
}
