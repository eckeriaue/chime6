import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatChipsModule} from '@angular/material/chips'
import {MatSelectModule} from '@angular/material/select'
import { uid } from 'radashi'
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { ApiService } from '../api/api'
import { Router } from '@angular/router'
import { filter, first } from 'rxjs/operators'

@Component({
  selector: 'app-create-room',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-room.html',
  styleUrl: './create-room.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoom {

  constructor(private apiService: ApiService) {}

  router = inject(Router)

  createRoomForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
    ]),
    roomName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
    ]),
    uid: new FormControl(uid(8), [
      Validators.required,
    ])
  })



  public submit() {
    if (this.createRoomForm.valid) {
      const { userName, roomName, uid: roomUid } = this.createRoomForm.value
      localStorage.setItem('user', JSON.stringify({ name: userName }))
      this.apiService.createRoom({
        owner: { name: userName, role: 'owner', uid: uid(8) },
        roomName,
        uid: roomUid
      }).pipe(
        filter(res => 'url' in res),
        first(),
      ).subscribe(res => {
        this.router.navigate([res.url], { queryParams: { myName: userName } })
      })
    }
  }
}
