/**
 * DeviceStatusCard - Displays current device identity and version
 */

function DeviceStatusCard({ device }) {
  return (
    <div className="card shadow-sm border-0 hover-lift">
      <div className="card-header border-0 py-3 px-4" style={{ background: 'linear-gradient(135deg, rgb(9 31 135) 0%, rgb(28 7 50) 100%)' }}>
        <h6 className="mb-0 fw-semibold text-white">
          <i className="bi bi-hdd-rack me-2"></i>
          Device Information
        </h6>
      </div>
      <div className="card-body p-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-muted small mb-2">Device ID</span>
              <div className="d-flex align-items-center">
                <span className="status-indicator bg-success"></span>
                <span className="fw-bold text-primary fs-5">{device.deviceId}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-muted small mb-2">Site ID</span>
              <span className="fw-semibold fs-5">{device.siteId}</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-muted small mb-2">Current Version</span>
              <span className="fw-semibold">
                <span className="badge bg-gradient-primary text-white fs-6">v{device.version}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceStatusCard;
