function EmptyState({ title = 'No Data', message = 'There is nothing to display at the moment.' }) {
  return (
    <div className="text-center py-5">
      <div className="display-1 text-muted mb-3">📭</div>
      <h4 className="text-muted">{title}</h4>
      <p className="text-muted">{message}</p>
    </div>
  );
}

export default EmptyState;
