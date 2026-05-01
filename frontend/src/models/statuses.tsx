export const LOCATION_TYPE = {
  REMOTE: {
    label: 'Remote',
    value: 'REMOTE',
  },
  PHYSICAL: {
    label: 'Physical',
    value: 'PHYSICAL',
  },
};

export const LocationTypeBadge = ({ status }: { status: string }) => {
  switch (status) {
    case LOCATION_TYPE.REMOTE.value:
      return <span className="badge badge-sm badge-primary">{LOCATION_TYPE.REMOTE.label}</span>;
    case LOCATION_TYPE.PHYSICAL.value:
      return <span className="badge badge-sm badge-secondary">{LOCATION_TYPE.PHYSICAL.label}</span>;
    default:
      return <span className="badge badge-sm">{status}</span>;
  }
};

export const JOB_STATUS = {
  NEW: {
    label: 'New',
    value: 'NEW',
  },
  ASSIGNED: {
    label: 'Assigned',
    value: 'ASSIGNED',
  },
  TRANSCRIBED: {
    label: 'Transcribed',
    value: 'TRANSCRIBED',
  },
  REVIEWED: {
    label: 'Reviewed',
    value: 'REVIEWED',
  },
  COMPLETED: {
    label: 'Completed',
    value: 'COMPLETED',
  },
};

export const JobStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case JOB_STATUS.NEW.value:
      return <span className="badge badge-sm badge-warning">{JOB_STATUS.NEW.label}</span>;
    case JOB_STATUS.ASSIGNED.value:
      return <span className="badge badge-sm badge-soft badge-primary">{JOB_STATUS.ASSIGNED.label}</span>;
    case JOB_STATUS.TRANSCRIBED.value:
      return <span className="badge badge-sm badge-accent">{JOB_STATUS.TRANSCRIBED.label}</span>;
    case JOB_STATUS.REVIEWED.value:
      return <span className="badge badge-sm badge-info">{JOB_STATUS.REVIEWED.label}</span>;
    case JOB_STATUS.COMPLETED.value:
      return <span className="badge badge-sm badge-success">{JOB_STATUS.COMPLETED.label}</span>;
    default:
      return <span className="badge badge-sm">{status}</span>;
  }
};
