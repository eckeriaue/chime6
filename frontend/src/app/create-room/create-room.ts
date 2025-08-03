import { Component, ChangeDetectionStrategy, model, computed } from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatChipsModule} from '@angular/material/chips'
import {MatSelectModule} from '@angular/material/select'
import { uid } from 'radashi'

@Component({
  selector: 'app-create-room',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, MatChipsModule, MatSelectModule],
  templateUrl: './create-room.html',
  styleUrl: './create-room.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoom {
  protected readonly uid = uid(8)

  userName = model('')
  roomName = model('')

  disabled = computed(() => {
    return this.userName().length < 1 || this.roomName().length < 1
  })
}
