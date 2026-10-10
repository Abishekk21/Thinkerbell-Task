/**
 * DeviceSettingsForm - Main form for editing device settings
 * Integrates the apply_update core function
 */

import { useState } from 'react';
import { apply_update } from '../core/applyUpdate';
import { languageOptions } from '../data/initialDevice';
import SaveStatus from './SaveStatus';
import ConflictPanel from './ConflictPanel';
import SloshGauge from './SloshGauge';

function DeviceSettingsForm({ initialDevice, actor }) {
  // Saved state (last known server state)
  const [savedDevice, setSavedDevice] = useState(initialDevice);
  
  // Form draft state
  const [language, setLanguage] = useState(initialDevice.settings.language);
  const [volume, setVolume] = useState(initialDevice.settings.volume);
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  const [conflictData, setConflictData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Check if there are unsaved changes
  const hasUnsavedChanges = 
    language !== savedDevice.settings.language ||
    volume !== savedDevice.settings.volume;

  // Handle save
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setConflictData(null);
    setSuccessMessage(null);

    // Small delay to show pending state
    setTimeout(() => {
      // Build the update request
      const request = {
        deviceId: savedDevice.deviceId,
        expectedVersion: savedDevice.version,
        settings: {}
      };

      // Only include changed settings
      if (language !== savedDevice.settings.language) {
        request.settings.language = language;
      }
      if (volume !== savedDevice.settings.volume) {
        request.settings.volume = volume;
      }

      // Call the real apply_update function
      const result = apply_update(savedDevice, actor, request);

      setIsSaving(false);

      // Handle result based on status code
      if (result.status === 200) {
        // Success!
        setSavedDevice(result.record);
        setLanguage(result.record.settings.language);
        setVolume(result.record.settings.volume);
        setLastSaved('just now');
        setSuccessMessage(`Settings saved successfully! Version updated to ${result.record.version}.`);
        
        setTimeout(() => setSuccessMessage(null), 5000);
      } else if (result.status === 403) {
        setError('You do not have permission to edit this device. Only editors for site ' + savedDevice.siteId + ' can make changes.');
      } else if (result.status === 422) {
        setError('Invalid input. Please check your settings and try again.');
      } else if (result.status === 404) {
        setError('Device not found. The device ID may have changed.');
      } else if (result.status === 409) {
        // Conflict - show the conflict panel
        setConflictData({
          expectedVersion: savedDevice.version,
          currentVersion: savedDevice.version + 1, // Simulate what might be the new version
          latestSettings: savedDevice.settings
        });
      } else {
        setError(`Unexpected error (${result.status}): ${result.error}`);
      }
    }, 300);
  };

  // Handle discard changes
  const handleDiscard = () => {
    setLanguage(savedDevice.settings.language);
    setVolume(savedDevice.settings.volume);
    setError(null);
    setConflictData(null);
    setSuccessMessage(null);
  };

  // Handle reload after conflict
  const handleReloadLatest = () => {
    setLanguage(savedDevice.settings.language);
    setVolume(savedDevice.settings.volume);
    setConflictData(null);
  };

  // Simulate concurrent update (development feature)
  const handleSimulateConcurrentUpdate = () => {
    const updatedDevice = {
      ...savedDevice,
      version: savedDevice.version + 1,
      settings: {
        ...savedDevice.settings,
        volume: savedDevice.settings.volume === 5 ? 1 : savedDevice.settings.volume + 1
      }
    };
    setSavedDevice(updatedDevice);
    setSuccessMessage(`⚠️ Simulated concurrent update! Version is now ${updatedDevice.version}, volume changed to ${updatedDevice.settings.volume}. Try saving your changes to see the conflict.`);
    setTimeout(() => setSuccessMessage(null), 8000);
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Conflict Panel */}
      <ConflictPanel 
        conflictData={conflictData}
        onReload={handleReloadLatest}
        onDismiss={() => setConflictData(null)}
      />

      {/* Settings Form */}
      <div className="card shadow-sm border-0 hover-lift">
        <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 text-secondary fw-semibold">
            <i className="bi bi-sliders me-2"></i>
            Device Settings
          </h6>
          <SaveStatus 
            isSaving={isSaving}
            hasUnsavedChanges={hasUnsavedChanges}
            lastSaved={lastSaved}
          />
        </div>
        <div className="card-body pt-3">
          <form onSubmit={handleSave}>
            {/* Language Setting */}
            <div className="mb-4">
              <label htmlFor="language-select" className="form-label fw-semibold fs-6">
                <i className="bi bi-translate me-2 text-primary"></i>
                Interface Language
              </label>
              <select
                id="language-select"
                className="form-select shadow-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isSaving}
                aria-label="Select device language"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="form-text">
                <i className="bi bi-info-circle me-1"></i>
                Select the primary language for the device interface
              </div>
            </div>

            {/* Volume Setting with SloshGauge */}
            <div className="mb-4">
              <label htmlFor="volume-control" className="form-label fw-semibold fs-6 mb-3">
                <i className="bi bi-volume-up-fill me-2 text-primary"></i>
                Audio Volume
              </label>
              
              <div className="d-flex gap-4 align-items-center">
                {/* SloshGauge Component */}
                <div className="flex-shrink-0">
                  <SloshGauge
                    value={(volume / 5) * 100}
                    onChange={(val) => setVolume(Math.round((val / 100) * 5))}
                    interactive
                    showValue
                    disabled={isSaving}
                    liquidColor="#667eea"
                    glassColor="#1a1a1a"
                    width={80}
                    height={200}
                    radius={16}
                    ticks={5}
                    viscosity={0.15}
                    tilt={0.45}
                    splash={0.42}
                    unit=""
                    ariaLabel="Audio Volume Control"
                  />
                </div>

                {/* Volume Information */}
                <div className="flex-grow-1">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">Current Level</span>
                      <span className="badge bg-primary fs-6">{volume} / 5</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-gradient-primary" 
                        role="progressbar" 
                        style={{ width: `${(volume / 5) * 100}%` }}
                        aria-valuenow={volume}
                        aria-valuemin="0"
                        aria-valuemax="5"
                      ></div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between text-muted small">
                    <span><i className="bi bi-volume-mute"></i> Silent</span>
                    <span><i className="bi bi-volume-down"></i> Low</span>
                    <span><i className="bi bi-volume-up"></i> Medium</span>
                    <span><i className="bi bi-volume-up-fill"></i> Maximum</span>
                  </div>

                  <div className="form-text mt-2">
                    <i className="bi bi-info-circle me-1"></i>
                    Drag the liquid gauge or use keyboard arrows to adjust volume (0-5)
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-4 shadow-sm"
                disabled={isSaving || !hasUnsavedChanges}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Save Changes
                  </>
                )}
              </button>

              {hasUnsavedChanges && !isSaving && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={handleDiscard}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Discard
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Development Tools */}
      <div className="mt-4">
        <div className="card border-warning border-2 shadow-sm hover-lift">
          <div className="card-header bg-warning bg-opacity-10 border-0">
            <h6 className="mb-0 text-warning fw-semibold">
              <i className="bi bi-tools me-2"></i>
              Development & Testing Tools
            </h6>
          </div>
          <div className="card-body">
            <p className="small text-secondary mb-3">
              <i className="bi bi-info-circle me-1"></i>
              Simulate a concurrent edit from another user to test conflict detection and resolution workflow:
            </p>
            <button
              type="button"
              className="btn btn-warning shadow-sm"
              onClick={handleSimulateConcurrentUpdate}
            >
              <i className="bi bi-lightning-fill me-2"></i>
              Simulate Concurrent Update
            </button>
            <p className="small text-muted mt-3 mb-0 fst-italic">
              This will update the saved device version and settings, causing your next save attempt to return a 409 CONFLICT status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceSettingsForm;
