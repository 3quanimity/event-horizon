import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EventItem } from '../../shared/interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: EventItem[] = [];
  private eventsSubject = new BehaviorSubject<EventItem[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor() {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('events');

    if (savedEvents) {
      this.events = JSON.parse(savedEvents);
      this.eventsSubject.next(this.events);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  getEvents(): Observable<EventItem[]> {
    return of(this.events);
  }

  getEvent(id: string): Observable<EventItem | undefined> {
    return of(this.events.find(event => event.id === id));
  }

  createEvent(event: Omit<EventItem, 'id'>): Observable<EventItem> {
    const newEvent: EventItem = {
      ...event,
      id: Date.now().toString(), // simple ID generation for MVP
    };

    this.events.push(newEvent);
    this.eventsSubject.next(this.events);
    this.saveToLocalStorage();

    return of(newEvent);
  }

  updateEvent(
    id: string,
    event: Partial<EventItem>
  ): Observable<EventItem | undefined> {
    const index = this.events.findIndex(event => event.id === id);

    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...event };
      this.eventsSubject.next(this.events);
      this.saveToLocalStorage();

      return of(this.events[index]);
    }

    return of(undefined);
  }

  deleteEvent(id: string): Observable<boolean> {
    const index = this.events.findIndex(event => event.id === id);

    if (index !== -1) {
      this.events.splice(index, 1);
      this.eventsSubject.next(this.events);
      this.saveToLocalStorage();
      return of(true);
    }

    return of(false);
  }
}
