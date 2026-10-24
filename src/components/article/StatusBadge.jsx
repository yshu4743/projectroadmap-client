import { STATUS_LABELS, STATUS_STYLES } from '../../lib/constants';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-stone-100 text-stone-600'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}