import { Component, computed, inject, resource } from '@angular/core'
import { ApiService } from '../api/api'
import { ActivatedRoute } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { Clipboard } from '@angular/cdk/clipboard'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MyVideo } from '../my-video/my-video'

@Component({
  selector: 'app-room',
  imports: [MatButtonModule, MyVideo],
  templateUrl: './room.html',
  styleUrl: './room.css'
})
export class Room {

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
  ) {}

  private snackbar = inject(MatSnackBar)


  room = resource({
    params: () => ({ id: this.route.snapshot.paramMap.get('id')! }),
    loader: ({ params }) => this.apiService.getRoom(params.id),
  })

  users = computed(() => {
    return this.room.hasValue() ? this.room.value().users : []
  })

  public async copyInviteLink() {
    const inviteLink = location.href
    if (this.clipboard.copy(inviteLink)) {
      this.snackbar.open('Скопировано', undefined, {
        duration: 2000,
      });
    }
  }


}
