import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EventItem } from '../../../shared/interfaces/event.interface';
import { Guest } from '../../../shared/interfaces/guest.interface';

@Component({
  selector: 'app-guest-form-dialog',
  templateUrl: './guest-form-dialog.component.html',
  styleUrls: ['./guest-form-dialog.component.scss'],
})
export class GuestFormDialogComponent {
  guestForm: FormGroup;
  events$: Observable<EventItem[]>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GuestFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { guest?: Guest; events$: Observable<EventItem[]> }
  ) {
    this.events$ = data.events$;
    this.guestForm = this.fb.group({
      id: [data.guest?.id || null],
      name: [data.guest?.name || '', Validators.required],
      email: [data.guest?.email || '', [Validators.required, Validators.email]],
      eventId: [data.guest?.eventId || '', Validators.required],
      rsvpStatus: [data.guest?.rsvpStatus || 'pending'],
    });
  }

  onSubmit(): void {
    if (this.guestForm.valid) {
      this.dialogRef.close(this.guestForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
