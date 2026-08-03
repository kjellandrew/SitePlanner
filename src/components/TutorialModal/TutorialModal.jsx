import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, FolderKanban, LayoutTemplate, ListTree, GripVertical, Layers, ImageIcon, Printer } from 'lucide-react';

const tutorialSteps = [
  {
    title: "1. Multi-Plan Management",
    icon: FolderKanban,
    description: "Organize multiple websites or project concepts independently. Click the folder icon in the navbar to open your saved plans, switch between them, rename them, or start a fresh new plan anytime.",
    tips: "Tip: Demo Mode lets you experiment freely without affecting saved projects."
  },
  {
    title: "2. Flow View & List View",
    icon: LayoutTemplate,
    description: "Switch seamlessly between two complementary views using the navbar toggle:",
    details: [
      "Flow View: Interactive visual node map powered by ReactFlow. Pan, zoom, and drag nodes to structure layout.",
      "List View: Clean tree hierarchy view optimized for outline editing and fast keyboard organization."
    ]
  },
  {
    title: "3. Drag & Drop Reordering",
    icon: GripVertical,
    description: "In List View, drag any page up or down to reorder items smoothly. Hover over the middle of a page card to reparent it as a child node, or drag to the bottom global area to create a Floating Section.",
    tips: "Tip: Floating sections let you maintain independent pages separate from your main Homepage tree."
  },
  {
    title: "4. Page Details & Content Blocks",
    icon: Layers,
    description: "Click the edit icon or page node to open the Page Details panel. Define structural sections (e.g. Hero Section, Pricing Table) and configure routing links. Linked blocks display dashed connecting arrows on the Flow View map!",
    tips: "Tip: Hold Cmd/Ctrl to link a single block to multiple destination pages."
  },
  {
    title: "5. Wireframe & Image Attachments",
    icon: ImageIcon,
    description: "Keep design inspiration, UI mockups, and wireframe images directly attached to relevant pages. Upload reference images in the Page Details panel to review them with your team.",
    tips: "Tip: Attachments are saved with your plan export files."
  },
  {
    title: "6. Custom Printouts & Data Backups",
    icon: Printer,
    description: "Press Cmd+P (Ctrl+P) or click Print to generate formatted printouts. Choose between a tidy nested list layout or clean card map grid, and toggle whether to include page blocks. Export and import JSON backups whenever needed.",
    tips: "Tip: Backups save all plans, pages, blocks, and uploaded images."
  }
];

export default function TutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const IconComponent = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentStep(prev => prev + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep(prev => prev - 1);
  };

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
          maxWidth: '540px',
          padding: '28px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary-color)'
            }}>
              <IconComponent size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Feature Guide
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Dots */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {tutorialSteps.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentStep(i)}
              style={{
                width: i === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === currentStep ? 'var(--primary-color)' : 'var(--border-color)',
                transition: 'all 0.25s ease',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

        {/* Step Content */}
        <div style={{
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
          backgroundColor: 'var(--bg-color)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {step.title}
          </h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {step.description}
          </p>

          {step.details && (
            <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {step.details.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          )}

          {step.tips && (
            <div style={{ marginTop: 'auto', fontSize: '0.75rem', fontWeight: 500, color: 'var(--primary-color)', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '8px 12px', borderRadius: '6px' }}>
              {step.tips}
            </div>
          )}
        </div>

        {/* Controls Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrev}
            disabled={isFirst}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: isFirst ? 'var(--border-color)' : 'var(--text-primary)',
              cursor: isFirst ? 'default' : 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {currentStep + 1} of {tutorialSteps.length}
          </span>

          <button
            onClick={handleNext}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {isLast ? (
              <>Got it! Start Building <Check size={16} /></>
            ) : (
              <>Next <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
