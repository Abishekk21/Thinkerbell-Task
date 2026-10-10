/**
 * Safe Device Settings Update - Main Application
 * Assessment implementation with React UI
 */

import { useState } from 'react';
import DeviceStatusCard from './components/DeviceStatusCard';
import DeviceSettingsForm from './components/DeviceSettingsForm';
import TestRunner from './components/TestRunner';
import { initialDevice, demoActor } from './data/initialDevice';

// Synthetic actor options for demonstration
const actorOptions = [
  { id: 'editor-s01', label: 'Editor — Site S01', actor: { siteId: 'S01', role: 'editor' } },
  { id: 'viewer-s01', label: 'Viewer — Site S01', actor: { siteId: 'S01', role: 'viewer' } },
  { id: 'editor-s02', label: 'Editor — Site S02', actor: { siteId: 'S02', role: 'editor' } }
];

function App() {
  const [showTests, setShowTests] = useState(false);
  const [selectedActorId, setSelectedActorId] = useState('editor-s01');
  
  const currentActor = actorOptions.find(opt => opt.id === selectedActorId)?.actor || demoActor;

  return (
    <div className="min-vh-100 bg-light">
      {/* Compact Header */}
      <nav className="navbar navbar-dark bg-dark shadow-sm border-bottom border-primary" style={{ minHeight: '64px' }}>
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex align-items-center w-100 gap-2">
            <span className="navbar-brand mb-0 h4 fw-bold d-flex align-items-center flex-shrink-0">
              <i className="bi bi-gear-wide-connected me-2 text-primary fs-3"></i>
              <span className="d-none d-md-inline">Device Settings</span>
              <span className="d-md-none">Settings</span>
            </span>
            
            <div className="d-flex align-items-center gap-2 ms-auto flex-nowrap">
              {/* Actor Selector - Dev Feature */}
              <div className="d-flex align-items-center gap-2 flex-nowrap">
                <label htmlFor="actor-select" className="text-white-50 small mb-0 d-none d-lg-inline text-nowrap">
                  Demo Actor:
                </label>
                <select
                  id="actor-select"
                  className="form-select form-select-sm py-1"
                  value={selectedActorId}
                  onChange={(e) => setSelectedActorId(e.target.value)}
                  style={{ minWidth: '170px', width: 'auto', fontSize: '0.875rem', lineHeight: '1.5' }}
                >
                  {actorOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-sm btn-outline-primary flex-shrink-0"
                onClick={() => setShowTests(!showTests)}
              >
                <i className="bi bi-code-square me-1"></i>
                <span className="d-none d-md-inline">Tests</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        <div className="row g-3">
          {/* Main Column - 2/3 width */}
          <div className="col-lg-8">
            {/* Device Status - Compact */}
            <DeviceStatusCard device={initialDevice} />

            {/* Settings Form */}
            <div className="mt-3">
              <DeviceSettingsForm 
                initialDevice={initialDevice}
                actor={currentActor}
              />
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="col-lg-4">
            {/* Info Card - Compact */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-header border-0 py-3 px-4" style={{ background: 'linear-gradient(135deg, rgb(9 31 135) 0%, rgb(28 7 50) 100%)' }}>
                <h6 className="mb-0 fw-semibold small text-white">
                  <i className="bi bi-info-circle me-2"></i>
                  System Features
                </h6>
              </div>
              <div className="card-body p-3">
                <ul className="small mb-0 list-unstyled">
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Permission-based access</span>
                  </li>
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Multi-layer validation</span>
                  </li>
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Optimistic concurrency</span>
                  </li>
                  <li className="d-flex align-items-start">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Conflict detection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Testing Guide & Dev Tools - Compact */}
            <div className="card shadow-sm border-0 border-start border-primary border-3">
              <div className="card-header border-0 py-3 px-4" style={{ background: 'linear-gradient(135deg, rgb(9 31 135) 0%, rgb(28 7 50) 100%)' }}>
                <h6 className="mb-0 fw-semibold small text-white">
                  <i className="bi bi-lightbulb me-2"></i>
                  Quick Test Guide
                </h6>
              </div>
              <div className="card-body p-3">
                <ol className="small mb-3 ps-3">
                  <li className="mb-2">Change settings and save</li>
                  <li className="mb-2">Simulate concurrent update</li>
                  <li className="mb-2">Try saving again</li>
                  <li>Resolve the conflict</li>
                </ol>
                
                {/* Development Tools Section */}
                <div className="border-top pt-3 mt-3">
                  <h6 className="small fw-semibold text-warning mb-2">
                    <i className="bi bi-tools me-1"></i>
                    Development Tools
                  </h6>
                  <p className="small text-muted mb-2">
                    Simulate a concurrent edit to test conflict detection:
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-warning w-100"
                    onClick={() => {
                      // Trigger the simulate function from form
                      const event = new CustomEvent('simulateConcurrentUpdate');
                      window.dispatchEvent(event);
                    }}
                  >
                    <i className="bi bi-lightning-fill me-2"></i>
                    Simulate Concurrent Update
                  </button>
                </div>

                <div className="alert alert-info small mb-0 mt-3 p-2">
                  <i className="bi bi-info-circle me-1"></i>
                  <strong>Demo:</strong> Use actor selector above to test permissions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Runner Modal */}
      {showTests && (
        <>
          <div className="modal-backdrop show" onClick={() => setShowTests(false)}></div>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-dark text-white border-0">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-check2-square me-2"></i>
                    Integrated Test Suite
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowTests(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <TestRunner />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
