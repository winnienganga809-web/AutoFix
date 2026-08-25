import { NavItem } from '@/components/ui/dashboard-nav';

export const customerNav: NavItem[] = [
  { label: 'Home', icon: '🏠', href: '/(customer)/home' },
  { label: 'Request', icon: '🔧', href: '/(customer)/request' },
  { label: 'Vehicles', icon: '🚗', href: '/(customer)/vehicles' },
  { label: 'Bookings', icon: '📋', href: '/(customer)/bookings' },
  { label: 'Payments', icon: '💰', href: '/(customer)/payments' },
  { label: 'Reviews', icon: '⭐', href: '/(customer)/reviews' },
  { label: 'Notifications', icon: '🔔', href: '/(customer)/notifications' },
  { label: 'Profile', icon: '👤', href: '/(customer)/profile' },
];

export const mechanicNav: NavItem[] = [
  { label: 'Home', icon: '🏠', href: '/(mechanic)/home' },
  { label: 'Job Requests', icon: '📨', href: '/(mechanic)/requests' },
  { label: 'Active Job', icon: '🔧', href: '/(mechanic)/active-job' },
  { label: 'Earnings', icon: '💰', href: '/(mechanic)/earnings' },
  { label: 'Reviews', icon: '⭐', href: '/(mechanic)/reviews' },
  { label: 'Verification', icon: '✓', href: '/(mechanic)/verification' },
  { label: 'Notifications', icon: '🔔', href: '/(mechanic)/notifications' },
  { label: 'Profile', icon: '👤', href: '/(mechanic)/profile' },
];

export const adminNav: NavItem[] = [
  { label: 'Overview', icon: '📊', href: '/(admin)/home' },
  { label: 'Customers', icon: '👥', href: '/(admin)/customers' },
  { label: 'Mechanics', icon: '🔧', href: '/(admin)/mechanics' },
  { label: 'Jobs', icon: '📋', href: '/(admin)/jobs' },
  { label: 'Services', icon: '🛠️', href: '/(admin)/services' },
  { label: 'Finance', icon: '💰', href: '/(admin)/finance' },
  { label: 'Reports', icon: '📈', href: '/(admin)/reports' },
  { label: 'Notifications', icon: '🔔', href: '/(admin)/notifications' },
];
