export const formatKES = (amount: number): string => {
  const number = typeof amount === 'number' ? amount : 0;
  return `KES ${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('254')) {
    return cleaned;
  }

  if (cleaned.startsWith('0')) {
    return '254' + cleaned.slice(1);
  }

  if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    return '254' + cleaned;
  }

  return cleaned;
};

export const isWindowOpen = (date = new Date()): boolean => {
  const day = date.getDay();
  const hour = date.getHours();
  const isWeekday = day >= 1 && day <= 5;
  const isTimeSlot = hour >= 10 && hour < 16;
  return isWeekday && isTimeSlot;
};
