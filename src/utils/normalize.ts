// Format date as HH:mm DD/MM/YYYY
export function formatDateTime(date: string, time: string): string {
  if (!date || !time) return '';
  // date is ISO format (2025-12-09T05:00:00.000Z), time is HH:mm:ss
  const formattedTime = time.split(':').slice(0, 2).join(':'); // Remove seconds
  return `${formattedTime} ${date.split('T')[0].split('-').reverse().join('/')}`;
}

// Helper to normalize match objects from snake_case (DB) to camelCase (frontend)
export function normalizeMatch(match: any) {
  return {
    id: match.id,
    home: match.home,
    away: match.away,
    date: match.date,
    time: match.time,
    formattedDateTime: formatDateTime(match.date, match.time),
    competition: match.competition,
    capacity: match.capacity,
    ticketsSold: match.tickets_sold ?? match.ticketsSold ?? 0,
    revenue: match.revenue ?? 0,
    status: match.status ?? 'active',
  };
}

export function normalizeMatches(matches: any[]) {
  return matches.map(normalizeMatch);
}
