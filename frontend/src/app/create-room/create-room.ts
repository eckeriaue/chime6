import { Component, ChangeDetectionStrategy, model, computed } from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatChipsModule} from '@angular/material/chips'
import {MatSelectModule} from '@angular/material/select'
import { uid } from 'radashi'
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { ApiService } from '../api/api'

@Component({
  selector: 'app-create-room',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, MatChipsModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './create-room.html',
  styleUrl: './create-room.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoom {

  constructor(private apiService: ApiService) {}

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
      const { userName, roomName, uid } = this.createRoomForm.value
      this.apiService.createRoom({ users: [{ name: userName }], roomName, uid }).subscribe(console.info)
    }
  }
}
