import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function Home() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);

    const result = await api.getHealth();

    if (result.success) {
      setHealth(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <Loading message="Checking API connection..." />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">Welcome to Full-Stack App</h1>
            <p className="lead text-muted">
              A modern full-stack application foundation built with React, Express, and MongoDB
            </p>
          </div>

          {/* API Status Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-server"></i> API Status
              </h5>
            </div>
            <div className="card-body">
              {error ? (
                <ErrorMessage message={error} onRetry={fetchHealth} />
              ) : (
                <>
                  <div className="mb-3">
                    <span className={`status-badge ${health?.database?.connected ? 'connected' : 'disconnected'}`}>
                      <span className={`status-indicator ${health?.database?.connected ? 'connected' : 'disconnected'}`}></span>
                      API {health?.database?.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>

                  <table className="table table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Message:</td>
                        <td>{health?.message}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Environment:</td>
                        <td>
                          <span className="badge bg-info">{health?.environment}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Uptime:</td>
                        <td>{health?.uptime?.toFixed(2)} seconds</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Database:</td>
                        <td>
                          {health?.database?.connected ? (
                            <span className="badge bg-success">Connected ({health?.database?.state})</span>
                          ) : (
                            <span className="badge bg-danger">Disconnected ({health?.database?.state})</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Last Checked:</td>
                        <td>{new Date(health?.timestamp).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>

                  <button className="btn btn-outline-primary btn-sm mt-3" onClick={fetchHealth}>
                    <i className="bi bi-arrow-clockwise"></i> Refresh Status
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="display-6 mb-3">⚛️</div>
                  <h5 className="card-title">React Frontend</h5>
                  <p className="card-text text-muted">
                    Built with React, Vite, and Bootstrap for a modern, responsive UI
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="display-6 mb-3">🚀</div>
                  <h5 className="card-title">Express Backend</h5>
                  <p className="card-text text-muted">
                    RESTful API with Node.js and Express, ready to scale
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="display-6 mb-3">🍃</div>
                  <h5 className="card-title">MongoDB Database</h5>
                  <p className="card-text text-muted">
                    Flexible NoSQL database with Mongoose ODM integration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info mt-4" role="alert">
            <h5 className="alert-heading">
              <i className="bi bi-info-circle"></i> Ready for Development
            </h5>
            <p className="mb-0">
              This is a starter foundation. Add your business logic, models, and features to build your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
