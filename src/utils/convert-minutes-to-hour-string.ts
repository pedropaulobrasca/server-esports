// 720 para 12:00
export default function convertMinutesToHourString(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}`;
}
