export const LocationTypeBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'REMOTE':
      return <span className="badge badge-sm badge-primary">Remote</span>;
    case 'PHYSICAL':
      return <span className="badge badge-sm badge-secondary">Onsite</span>;
    default:
      return <span className="badge badge-sm">{status}</span>;
  }
};

export const JobStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'NEW':
      return <span className="badge badge-sm badge-warning">New</span>;
    case 'ASSIGNED':
      return <span className="badge badge-sm badge-soft badge-primary">Assigned</span>;
    case 'TRANSCRIBED':
      return <span className="badge badge-sm badge-accent">Transcribed</span>;
    case 'REVIEWED':
      return <span className="badge badge-sm badge-info">Reviewed</span>;
    case 'COMPLETED':
      return <span className="badge badge-sm badge-success">Completed</span>;
    default:
      return <span className="badge badge-sm">{status}</span>;
  }
};
