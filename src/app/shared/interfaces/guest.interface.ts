export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'pending' | 'accepted' | 'declined';
  eventId: string;
}
