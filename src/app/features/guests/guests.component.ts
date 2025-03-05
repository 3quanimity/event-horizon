import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EventService } from '../../core/services/event.service';
import { GuestService } from '../../core/services/guest.service';
import { EventItem } from '../../shared/interfaces/event.interface';
import { Guest } from '../../shared/interfaces/guest.interface';
import { GuestFormDialogComponent } from './guest-form-dialog/guest-form-dialog.component';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.scss'],
})
export class GuestsComponent implements OnInit {
  guests$: Observable<Guest[]>;
  events$: Observable<EventItem[]>;
  displayedColumns: string[] = [
    'name',
    'email',
    'event',
    'rsvpStatus',
    'actions',
  ];

  constructor(
    private guestService: GuestService,
    private eventService: EventService,
    private dialog: MatDialog
  ) {
    this.guests$ = this.guestService.guests$;
    this.events$ = this.eventService.events$;
  }

  ngOnInit(): void {
    // Load initial data
    this.guestService.getGuests().subscribe();
    this.eventService.getEvents().subscribe();
  }

  getEventTitle(events: EventItem[], eventId: string): string {
    return events.find(e => e.id === eventId)?.title || 'N/A';
  }

  openGuestDialog(guest?: Guest): void {
    const dialogRef = this.dialog.open(GuestFormDialogComponent, {
      width: '500px',
      data: { guest, events$: this.events$ },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.guestService.updateGuest(result.id, result).subscribe();
        } else {
          this.guestService.createGuest(result).subscribe();
        }
      }
    });
  }

  updateRsvpStatus(guest: Guest, status: Guest['rsvpStatus']): void {
    this.guestService.updateGuestStatus(guest.id, status).subscribe();
  }

  removeGuest(id: string): void {
    if (confirm('Are you sure you want to remove this guest?')) {
      this.guestService.deleteGuest(id).subscribe();
    }
  }
}
