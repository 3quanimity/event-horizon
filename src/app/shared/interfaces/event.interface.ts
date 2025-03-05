export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: string;
  guests?: string[]; // array of guests IDs
}
