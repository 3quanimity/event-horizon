import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../shared/interfaces/event.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  upcomingEvents$: Observable<Event[]>;
  totalEvents$: Observable<number>;

  constructor(private eventService: EventService) {
    // Get upcoming events (nex 30 days)
    this.upcomingEvents$ = this.eventService.events$.pipe(
      map(events => {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        return events
          .filter(event => new Date(event.date) <= thirtyDaysFromNow)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 5); // show only next 5 events
      })
    );

    this.totalEvents$ = this.eventService.events$.pipe(
      map(events => events.length)
    );
  }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe();
  }
}
