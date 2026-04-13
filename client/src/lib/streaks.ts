export function getWeekKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - jan1.getTime()) / 86400000);
  const weekNumber = Math.ceil((days + jan1.getDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

export function isStreakActive(lastActivityDate: string): boolean {
  if (!lastActivityDate) return false;
  const last = new Date(lastActivityDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / 86400000);
  return diffDays <= 1;
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak < 7) return `${streak} day streak — keep it going!`;
  if (streak < 30) return `${streak} days — you're on fire!`;
  return `${streak} days — legendary!`;
}
