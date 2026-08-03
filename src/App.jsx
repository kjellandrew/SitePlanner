import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Download, Upload, LayoutTemplate, ListTree, FolderKanban, Plus, Edit2, Trash2, AlertTriangle, Printer } from 'lucide-react';
import FlowView from './components/FlowView/FlowView';
import ListView from './components/ListView/ListView';
import PageDetails from './components/PageDetails/PageDetails';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';
import PlanSelectorModal from './components/PlanSelectorModal/PlanSelectorModal';
import { useStore } from './store/useStore';

function App() {
  const [view, setView] = useState('flow'); // 'flow' | 'list'
  const [theme, setTheme] = useState('dark');
  const [editingPageId, setEditingPageId] = useState(null);
  
  const [isRenamingPlan, setIsRenamingPlan] = useState(false);
  const [planNameInput, setPlanNameInput] = useState('');
  
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const plans = useStore(state => state.plans || []);
  const activePlanId = useStore(state => state.activePlanId);
  const createPlan = useStore(state => state.createPlan);
  const switchPlan = useStore(state => state.switchPlan);
  const renamePlan = useStore(state => state.renamePlan);
  const deletePlan = useStore(state => state.deletePlan);

  const exportData = useStore(state => state.exportData);
  const importData = useStore(state => state.importData);
  const fileInputRef = useRef(null);

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0] || {};

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const openEditDetails = (pageId) => {
    setEditingPageId(pageId);
    window.history.pushState({ editingPageId: pageId }, '');
  };

  const closeEditDetails = () => {
    setEditingPageId(null);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (editingPageId) {
        setEditingPageId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [editingPageId]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        importData(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleStartRename = () => {
    if (activePlan.isDemo) return;
    setPlanNameInput(activePlan.name || '');
    setIsRenamingPlan(true);
  };

  const handleSaveRename = () => {
    if (planNameInput.trim()) {
      renamePlan(activePlanId, planNameInput.trim());
    }
    setIsRenamingPlan(false);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '10px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 10
      }}>
        {/* Left Section: Logo & Plan Manager */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--primary-color)', letterSpacing: '-0.02em' }}>
            Site Planner
          </h1>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>
          
          {/* Multi-Plan Selector Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setIsPlanModalOpen(true)}
              style={{ color: 'var(--text-secondary)', display: 'flex', padding: '4px' }}
              title="Open Saved Plans"
            >
              <FolderKanban size={18} />
            </button>
            
            {isRenamingPlan ? (
              <input
                type="text"
                value={planNameInput}
                onChange={(e) => setPlanNameInput(e.target.value)}
                onBlur={handleSaveRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') setIsRenamingPlan(false);
                }}
                autoFocus
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--primary-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '4px 8px',
                  outline: 'none'
                }}
              />
            ) : (
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', padding: '5px 4px' }}>
                {activePlan.name} {activePlan.isDemo ? '(Demo)' : ''}
              </span>
            )}

            {/* Plan Action Buttons */}
            {!isRenamingPlan && !activePlan.isDemo && (
              <button 
                onClick={handleStartRename} 
                style={{ padding: '6px', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)' }} 
                title="Rename Plan"
              >
                <Edit2 size={15} />
              </button>
            )}

            <button 
              onClick={() => createPlan(`Plan ${plans.length + 1}`)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '5px 10px', 
                backgroundColor: 'var(--bg-color)', 
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: 500
              }} 
              title="Create New Plan"
            >
              <Plus size={14} /> New Plan
            </button>

            {plans.length > 1 && !activePlan.isDemo && (
              <button 
                onClick={() => setPlanToDelete(activePlanId)} 
                style={{ padding: '6px', color: 'var(--danger-color)', borderRadius: 'var(--radius-md)' }} 
                title="Delete Current Plan"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          {/* Warning Banner for Unsaved Demo Plan */}
          {activePlan.isDemo && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#eab308',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              <AlertTriangle size={14} />
              <span>Demo Mode: Changes will not be saved</span>
            </div>
          )}
        </div>

        {/* Center: View Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-color)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button 
            onClick={() => setView('flow')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: view === 'flow' ? 'var(--bg-surface)' : 'transparent',
              color: view === 'flow' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: view === 'flow' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <LayoutTemplate size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Flow View</span>
          </button>
          <button 
            onClick={() => setView('list')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: view === 'list' ? 'var(--bg-surface)' : 'transparent',
              color: view === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: view === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <ListTree size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>List View</span>
          </button>
        </div>

        {/* Right Section: Import / Export & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
          >
            <Upload size={18} />
            <span style={{ fontSize: '0.875rem' }}>Import</span>
          </button>
          <button 
            onClick={exportData}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
          >
            <Download size={18} />
            <span style={{ fontSize: '0.875rem' }}>Export</span>
          </button>
          
          <button 
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
            title="Print Current View (Cmd/Ctrl + P)"
          >
            <Printer size={18} />
            <span style={{ fontSize: '0.875rem' }}>Print</span>
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>
          
          <button onClick={toggleTheme} style={{ color: 'var(--text-secondary)' }} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {view === 'flow' ? (
          <FlowView onEditNode={openEditDetails} />
        ) : (
          <div style={{ padding: '0 24px', height: '100%', overflowY: 'auto', backgroundColor: 'var(--bg-color)' }}>
            <ListView onEditNode={openEditDetails} />
          </div>
        )}

        {/* Page Details Overlay */}
        {editingPageId && (
          <>
            {/* Backdrop */}
            <div 
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                zIndex: 90,
                backdropFilter: 'blur(2px)'
              }}
              onClick={closeEditDetails}
            />
            <PageDetails 
              pageId={editingPageId} 
              onClose={closeEditDetails} 
            />
          </>
        )}

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

        <PlanSelectorModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
        />

      </main>
    </div>
  );
}

export default App;
