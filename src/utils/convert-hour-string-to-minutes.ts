// Recebe 12:00 e retorna 1200
export default function convertHourStringToMinutes(time: string) {
  const [hour, minutes] = time.split(":").map(Number);
  const timeInMinutes = hour * 60 + minutes;

  return timeInMinutes;
}
