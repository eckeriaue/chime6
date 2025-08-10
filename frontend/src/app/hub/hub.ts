import {
  Component,
  resource,
  ChangeDetectionStrategy
} from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatSelectModule} from '@angular/material/select'
import { ApiService } from '../api/api'
import { RouterModule } from '@angular/router'


@Component({
  selector: 'app-hub',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './hub.html',
  styleUrl: './hub.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hub {
  constructor(private apiService: ApiService) {}

  rooms = resource({
    loader: () => this.apiService.getRooms()
  })

}
