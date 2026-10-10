function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger" role="alert">
      <h5 className="alert-heading">
        <i className="bi bi-exclamation-triangle"></i> Error
      </h5>
      <p className="mb-0">{message}</p>
      {onRetry && (
        <button className="btn btn-danger btn-sm mt-3" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
