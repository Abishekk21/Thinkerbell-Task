/**
 * SaveStatus - Shows save state and pending indicator
 */

function SaveStatus({ isSaving, hasUnsavedChanges, lastSaved }) {
  if (isSaving) {
    return (
      <div className="d-flex align-items-center text-muted small">
        <div className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Saving...</span>
        </div>
        Saving changes...
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="text-warning small">
        <i className="bi bi-exclamation-circle me-1"></i>
        Unsaved changes
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="text-success small">
        <i className="bi bi-check-circle me-1"></i>
        Saved {lastSaved}
      </div>
    );
  }

  return null;
}

export default SaveStatus;
