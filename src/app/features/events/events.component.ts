import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../shared/interfaces/event.interface';
import { EventFormDialogComponent } from './event-form-dialog/event-form-dialog.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  events$: Observable<Event[]>;
  displayedColumns: string[] = ['title', 'date', 'location', 'actions'];

  constructor(private eventService: EventService, private dialog: MatDialog) {
    this.events$ = this.eventService.events$;
  }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe();
  }

  openEventDialog(event?: Event): void {
    const dialogRef = this.dialog.open(EventFormDialogComponent, {
      width: '500px',
      data: event || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.eventService.updateEvent(result.id, result).subscribe();
        } else {
          this.eventService.createEvent(result).subscribe();
        }
      }
    });
  }

  deleteEvent(id: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe();
    }
  }
}
