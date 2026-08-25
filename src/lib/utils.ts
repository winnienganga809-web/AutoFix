export function formatKSh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) +
    ', ' + d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function calculatePlatformFee(jobPrice: number, feePercentage: number): number {
  return Math.round(jobPrice * (feePercentage / 100) * 100) / 100;
}

export function calculateMechanicEarnings(jobPrice: number, platformFee: number): number {
  return Math.round((jobPrice - platformFee) * 100) / 100;
}

export const JOB_STATUS_LABELS: Record<string, string> = {
  request_submitted: 'Request Submitted',
  mechanic_searching: 'Searching for Mechanic',
  mechanic_accepted: 'Mechanic Accepted',
  mechanic_travelling: 'Mechanic Travelling',
  mechanic_arrived: 'Mechanic Arrived',
  work_started: 'Work Started',
  work_completed: 'Work Completed',
  payment: 'Payment Pending',
  completed_reviewed: 'Completed',
  cancelled: 'Cancelled',
};

export const JOB_STATUS_COLORS: Record<string, string> = {
  request_submitted: '#F59E0B',
  mechanic_searching: '#F59E0B',
  mechanic_accepted: '#3B82F6',
  mechanic_travelling: '#3B82F6',
  mechanic_arrived: '#10B981',
  work_started: '#10B981',
  work_completed: '#059669',
  payment: '#8B5CF6',
  completed_reviewed: '#059669',
  cancelled: '#EF4444',
};

export const VERIFICATION_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  verified: 'Verified',
  rejected: 'Rejected',
};

export const VERIFICATION_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  verified: '#10B981',
  rejected: '#EF4444',
};

export const KENYAN_LOCATIONS = [
  'Nairobi CBD', 'Westlands', 'Kasarani', 'Embakasi', 'Karen',
  'Langata', 'Kilimani', 'Lavington', 'South B', 'South C',
  'Ruaka', 'Rongai', 'Ngong', 'Kikuyu', 'Thika Road',
  'Mombasa Road', 'Industrial Area', 'Gigiri', 'Muthaiga', 'Parklands',
  'Roysambu', 'Zimmerman', 'Githurai', 'Ruiru', 'Juja',
  'Athi River', 'Syokimau', 'Kitengela', 'Mlolongo', 'Machakos',
];

export const VEHICLE_MAKES = [
  'Toyota', 'Nissan', 'Honda', 'Mazda', 'Suzuki',
  'Mitsubishi', 'Subaru', 'Isuzu', 'Mercedes-Benz', 'BMW',
  'Audi', 'Volkswagen', 'Land Rover', 'Range Rover', 'Ford',
  'Hyundai', 'Kia', 'Peugeot', 'Renault', 'Lexus',
  'Volvo', 'Jeep', 'Chevrolet', 'Daewoo', 'Other',
];
