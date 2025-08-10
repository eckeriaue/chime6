import { Component, computed, resource } from '@angular/core'
import { ApiService } from '../api/api'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-room',
  imports: [],
  templateUrl: './room.html',
  styleUrl: './room.css'
})
export class Room {

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}


  room = resource({
    params: () => ({ id: this.route.snapshot.paramMap.get('id')! }),
    loader: ({ params }) => this.apiService.getRoom(params.id),
  })

  users = computed(() => {
    return this.room.hasValue() ? this.room.value().users : []
  })

}
