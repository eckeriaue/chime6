import { Component, ChangeDetectionStrategy } from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatSelectModule} from '@angular/material/select'

@Component({
  selector: 'app-hub',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './hub.html',
  styleUrl: './hub.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hub {

}
