import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-6 mx-auto text-center">
          <div className="display-1 text-primary mb-4">404</div>
          <h2 className="mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house"></i> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
