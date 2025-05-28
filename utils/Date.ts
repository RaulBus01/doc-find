export const formatDate = (t:any,dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    // Get today's date for comparison
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format time
    const timeString = date.toLocaleTimeString(t('date'), {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return `${t('dateToday')} ${timeString}`;
    }

    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `${t('dateYesterday')} ${timeString}`;
    }

    // If date is within this year
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString(t('date'), {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    // For older dates
    return date.toLocaleDateString(t('date'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

