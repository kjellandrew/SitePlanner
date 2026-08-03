import React from 'react';
import { X, Printer, FileText, LayoutTemplate, CheckSquare, Square } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function PrintModal({ 
  isOpen, 
  onClose, 
  printView, 
  setPrintView, 
  includeBlocks, 
  setIncludeBlocks 
}) {
  const plans = useStore(state => state.plans || []);
  const activePlanId = useStore(state => state.activePlanId);
  const activePlan = plans.find(p => p.id === activePlanId) || {};

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      <div 
        className="no-print"
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
          backdropFilter: 'blur(2px)'
        }}
        onClick={onClose}
      />
      <div 
        className="no-print"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1000,
          width: '90%',
          maxWidth: '460px',
          padding: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Printer size={22} style={{ color: 'var(--primary-color)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Print Options
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Configure your print layout for <strong>{activePlan.name || 'Sitemap Plan'}</strong>.
        </div>

        {/* View Mode Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Print Layout Style
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setPrintView('list')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${printView === 'list' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                backgroundColor: printView === 'list' ? 'var(--bg-surface-hover)' : 'var(--bg-color)',
                color: printView === 'list' ? 'var(--primary-color)' : 'var(--text-primary)',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              <FileText size={16} />
              Nested List
            </button>
            <button
              onClick={() => setPrintView('map')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${printView === 'map' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                backgroundColor: printView === 'map' ? 'var(--bg-surface-hover)' : 'var(--bg-color)',
                color: printView === 'map' ? 'var(--primary-color)' : 'var(--text-primary)',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              <LayoutTemplate size={16} />
              Card Map
            </button>
          </div>
        </div>

        {/* Option: Include Page Blocks */}
        <div 
          onClick={() => setIncludeBlocks(!includeBlocks)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-color)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          {includeBlocks ? (
            <CheckSquare size={18} style={{ color: 'var(--primary-color)' }} />
          ) : (
            <Square size={18} style={{ color: 'var(--text-secondary)' }} />
          )}
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Include Page Content Blocks
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleTriggerPrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Printer size={16} />
            Print Now
          </button>
        </div>
      </div>
    </>
  );
}
