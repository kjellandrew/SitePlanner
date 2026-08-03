import React from 'react';
import { useStore } from '../../store/useStore';

const buildTree = (pages = [], parentId = null, visited = new Set()) => {
  if (!Array.isArray(pages)) return [];
  
  return pages
    .filter(p => p && p.parentId === parentId && !visited.has(p.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(p => {
      const nextVisited = new Set(visited);
      nextVisited.add(p.id);
      return {
        ...p,
        children: buildTree(pages, p.id, nextVisited)
      };
    });
};

function PrintUnorderedNode({ page, includeBlocks, blocksMap }) {
  const pageBlocks = (page && page.id && blocksMap && blocksMap[page.id]) || [];
  const children = Array.isArray(page.children) ? page.children : [];

  return (
    <li style={{ marginBottom: '10px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <div style={{ lineHeight: 1.4 }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#000000' }}>
          {page.title || 'Untitled Page'}
        </span>
        {page.description && (
          <div style={{ fontSize: '0.8125rem', color: '#4b5563', fontStyle: 'italic', marginTop: '2px' }}>
            {page.description}
          </div>
        )}
      </div>

      {/* Optional Page Content Blocks */}
      {includeBlocks && pageBlocks.length > 0 && (
        <ul style={{ marginTop: '4px', marginBottom: '6px', paddingLeft: '18px', listStyleType: 'square' }}>
          {pageBlocks.map((b, i) => (
            <li key={b.id || i} style={{ fontSize: '0.75rem', color: '#374151', margin: '2px 0', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <strong>{b.title || `Block ${i + 1}`}</strong>
              {b.description && <span> — {b.description}</span>}
            </li>
          ))}
        </ul>
      )}

      {/* Children List */}
      {children.length > 0 && (
        <ul style={{ marginTop: '6px', paddingLeft: '20px', listStyleType: 'inherit' }}>
          {children.map(child => (
            <PrintUnorderedNode
              key={child.id}
              page={child}
              includeBlocks={includeBlocks}
              blocksMap={blocksMap}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function PrintView({ includeBlocks = true }) {
  const pages = useStore(state => state.pages || []);
  const blocksMap = useStore(state => state.blocks || {});
  const plans = useStore(state => state.plans || []);
  const activePlanId = useStore(state => state.activePlanId);
  const activePlan = plans.find(p => p.id === activePlanId) || {};

  const safePages = Array.isArray(pages) ? pages : [];
  const mainTree = buildTree(safePages, null).filter(p => p && p.id === 'root');
  const floatingRoots = safePages
    .filter(p => p && p.parentId === null && p.id !== 'root')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div 
      id="printable-area"
      className="print-only" 
      style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
        color: '#000000', 
        backgroundColor: '#ffffff',
        padding: '24px 32px',
        maxWidth: '800px',
        margin: '0 auto',
        fontSize: '13px'
      }}
    >
      {/* Document Header */}
      <div style={{ borderBottom: '2px solid #000000', paddingBottom: '12px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#000000' }}>
          {activePlan.name || 'Sitemap Plan'}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#6b7280' }}>
          <span>Site Planner — Sitemap Hierarchy</span>
          <span>Printed {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Sitemap Hierarchy */}
      <div style={{ marginBottom: '32px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#000000', margin: '0 0 12px 0', borderBottom: '1px solid #d1d5db', paddingBottom: '4px' }}>
          Sitemap Hierarchy
        </h2>
        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
          {mainTree.map(rootNode => (
            <PrintUnorderedNode
              key={rootNode.id}
              page={rootNode}
              includeBlocks={includeBlocks}
              blocksMap={blocksMap}
            />
          ))}
        </ul>
      </div>

      {/* Floating Sections */}
      {floatingRoots.length > 0 && (
        <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#000000', margin: '0 0 12px 0', borderBottom: '1px solid #d1d5db', paddingBottom: '4px' }}>
            Floating Sections
          </h2>
          {floatingRoots.map(fp => {
            const fpTree = { ...fp, children: buildTree(safePages, fp.id) };
            const secTitle = fp.sectionTitle || `${fp.title || 'Floating'} Section`;
            return (
              <div key={fp.id} style={{ marginBottom: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', margin: '0 0 6px 0' }}>
                  {secTitle}
                </h3>
                <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                  <PrintUnorderedNode
                    page={fpTree}
                    includeBlocks={includeBlocks}
                    blocksMap={blocksMap}
                  />
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
