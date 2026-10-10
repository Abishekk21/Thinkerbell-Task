/**
 * ConflictPanel - Handles version conflict resolution
 */

function ConflictPanel({ conflictData, onReload, onDismiss }) {
  if (!conflictData) return null;

  return (
    <div className="alert alert-warning border-warning shadow-sm" role="alert">
      <div className="d-flex">
        <div className="flex-shrink-0">
          <i className="bi bi-exclamation-triangle-fill fs-4"></i>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="alert-heading mb-2">Version Conflict Detected</h6>
          <p className="mb-3">
            Another user has modified this device. The record has been updated from version{' '}
            <strong>{conflictData.expectedVersion}</strong> to <strong>{conflictData.currentVersion}</strong>.
          </p>
          
          <div className="mb-3 p-3 bg-light rounded">
            <h6 className="small text-muted mb-2">Latest Saved Values:</h6>
            <div className="row g-2 small">
              <div className="col-6">
                <strong>Language:</strong> {conflictData.latestSettings.language}
              </div>
              <div className="col-6">
                <strong>Volume:</strong> {conflictData.latestSettings.volume}
              </div>
            </div>
          </div>

          <div className="alert alert-info mb-3 py-2 small">
            <i className="bi bi-info-circle me-1"></i>
            Your unsaved changes have been preserved and are still in the form above.
          </div>

          <div className="d-flex gap-2">
            <button 
              className="btn btn-warning btn-sm"
              onClick={onReload}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Reload Latest Values
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={onDismiss}
            >
              Keep My Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConflictPanel;
