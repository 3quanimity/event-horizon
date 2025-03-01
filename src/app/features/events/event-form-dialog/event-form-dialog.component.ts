import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../../shared/interfaces/event.interface';

@Component({
  selector: 'app-event-form-dialog',
  templateUrl: './event-form-dialog.component.html',
  styleUrls: ['./event-form-dialog.component.scss'],
})
export class EventFormDialogComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event
  ) {
    this.eventForm = this.fb.group({
      id: [data.id || null],
      title: [data.title || '', Validators.required],
      description: [data.description || ''],
      date: [data.date || null, Validators.required],
      location: [data.location || '', Validators.required],
      createdBy: [data.createdBy || ''],
      guests: [data.guests || []],
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
