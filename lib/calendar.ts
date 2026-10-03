import { ConcertEvent } from './types';

export function generateGoogleCalendarUrl(concert: ConcertEvent): string {
  const startDate = new Date(concert.date);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // approx 4 hours duration

  const formatGCalDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const title = encodeURIComponent(`${concert.artist}: ${concert.title}`);
  const details = encodeURIComponent(
    `Live concert by ${concert.artist} at ${concert.venue_name}.\nDoors open: ${concert.doors_time}\nSupport acts: ${concert.support_acts.join(', ')}\n\nExplore on Concert Finder.`
  );
  const location = encodeURIComponent(`${concert.venue_name}, ${concert.venue_address}`);
  const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function downloadIcsFile(concert: ConcertEvent): void {
  if (typeof window === 'undefined') return;

  const startDate = new Date(concert.date);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Concert Finder//Live Shows//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:concert-${concert.id}-${Date.now()}@concertfinder.app`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${concert.artist} - ${concert.title}`,
    `DESCRIPTION:Live concert at ${concert.venue_name}. Doors open at ${concert.doors_time}. Support: ${concert.support_acts.join(', ')}`,
    `LOCATION:${concert.venue_name}, ${concert.venue_address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${concert.artist.replace(/\s+/g, '_')}_Concert.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
