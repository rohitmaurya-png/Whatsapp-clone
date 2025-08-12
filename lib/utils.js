import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'dd/MM/yyyy');
  }
}

export function formatLastSeen(timestamp) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return `Today at ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy HH:mm');
  }
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
