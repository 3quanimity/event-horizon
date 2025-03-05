import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Guest } from '../../shared/interfaces/guest.interface';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private guests: Guest[] = [];
  private guestsSubject = new BehaviorSubject<Guest[]>([]);
  public guests$ = this.guestsSubject.asObservable();

  constructor() {
    // Load guests from localStorage
    const savedGuests = localStorage.getItem('guests');
    if (savedGuests) {
      this.guests = JSON.parse(savedGuests);
      this.guestsSubject.next(this.guests);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('guests', JSON.stringify(this.guests));
  }

  getGuests(eventId?: string): Observable<Guest[]> {
    if (eventId) {
      return of(this.guests.filter(guest => guest.eventId === eventId));
    }
    return of(this.guests);
  }

  createGuest(guest: Omit<Guest, 'id'>): Observable<Guest> {
    const newGuest: Guest = {
      ...guest,
      id: Date.now().toString(),
    };

    this.guests.push(newGuest);
    this.guestsSubject.next(this.guests);
    this.saveToLocalStorage();

    return of(newGuest);
  }

  updateGuest(id: string, updates: Partial<Guest>): Observable<Guest | undefined> {
    const index = this.guests.findIndex(guest => guest.id === id);
    if (index !== -1) {
      this.guests[index] = { ...this.guests[index], ...updates };
      this.guestsSubject.next(this.guests);
      this.saveToLocalStorage();
      return of(this.guests[index]);
    }
    return of(undefined);
  }

  updateGuestStatus(id: string, rsvpStatus: Guest['rsvpStatus']): Observable<Guest | undefined> {
    return this.updateGuest(id, { rsvpStatus });
  }

  deleteGuest(id: string): Observable<boolean> {
    const index = this.guests.findIndex(guest => guest.id === id);
    if (index !== -1) {
      this.guests.splice(index, 1);
      this.guestsSubject.next(this.guests);
      this.saveToLocalStorage();
      return of(true);
    }
    return of(false);
  }
}
