import React from 'react';
import { Sparkles, ArrowRight, HelpCircle, X, CheckCircle2 } from 'lucide-react';

export default function WelcomeModal({ isOpen, onClose, onStartTutorial, onCreatePlan }) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="no-print"
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 999,
          backdropFilter: 'blur(3px)'
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
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          zIndex: 1000,
          width: '90%',
          maxWidth: '520px',
          padding: '28px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary-color)'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Welcome to Site Planner!
              </h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Visual Sitemap & User Flow Planning Tool
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Site Planner helps you map website structures, organize page hierarchies, plan content sections, and map out navigation flows effortlessly.
        </p>

        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-color)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Quick Instructions:
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
            <span>Switch between <strong>Flow View</strong> (visual node graph) and <strong>List View</strong> (drag & drop reordering tree).</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
            <span>Click any page to edit details, add content blocks, link routes, or attach wireframe images.</span>
          </div>
        </div>

        {/* Callout invitation for Tutorial */}
        <div 
          onClick={onStartTutorial}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={20} style={{ color: 'var(--primary-color)' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                Want a quick walkthrough?
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Click here to take a guided tour of all key features.
              </div>
            </div>
          </div>
          <ArrowRight size={18} style={{ color: 'var(--primary-color)' }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            Explore Demo
          </button>
          <button 
            onClick={() => {
              onClose();
              onCreatePlan();
            }}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Create First Plan
          </button>
        </div>
      </div>
    </>
  );
}
