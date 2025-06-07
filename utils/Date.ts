export const formatDate = (t:any,dateString: string): string => {
  try {
    const date = new Date(dateString);
    
   
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }


    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);


    const timeString = date.toLocaleTimeString(t('date'), {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });


    if (date.toDateString() === today.toDateString()) {
      return `${t('dateToday')} ${timeString}`;
    }


    if (date.toDateString() === yesterday.toDateString()) {
      return `${t('dateYesterday')} ${timeString}`;
    }

    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString(t('date'), {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }


    return date.toLocaleDateString(t('date'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
   
    return 'Invalid date';
  }
};

