import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Event } from '../../shared/interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: Event[] = [];
  private eventsSubject = new BehaviorSubject<Event[]>([]);
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

  getEvents(): Observable<Event[]> {
    return of(this.events);
  }

  getEvent(id: string): Observable<Event | undefined> {
    return of(this.events.find(event => event.id === id));
  }

  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    const newEvent: Event = {
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
    event: Partial<Event>
  ): Observable<Event | undefined> {
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
