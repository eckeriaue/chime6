import { Component } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { inject } from '@angular/core'
import { uid } from 'radashi'

import {
  // MAT_DIALOG_DATA,
  // MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'

@Component({
  selector: 'app-room-prepare-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  template: `
    <h2 mat-dialog-title>Подготовка к звонку</h2>
    <mat-dialog-content class="w-full">
      <form (ngSubmit)="submit()" [formGroup]="prepareForm">
        <p>Введите ваше имя</p>
        <mat-form-field class="w-full">
          <mat-label>Имя</mat-label>
          <input matInput name="userName" cdkFocusInitial formControlName="userName" required />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton [mat-dialog-close]="true" type="submit">Войти</button>
    </mat-dialog-actions>
  `,
  styles: ``
})
export class RoomPrepareDialog {

  prepareForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    uid: new FormControl(uid(8), [Validators.required]),
  })

  readonly dialogRef = inject(MatDialogRef<RoomPrepareDialog>)

  submit() {
    this.dialogRef.close(this.prepareForm.value)
  }

}
