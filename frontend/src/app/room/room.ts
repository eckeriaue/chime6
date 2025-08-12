import { Component, computed, signal, effect, inject, resource } from '@angular/core'
import { ApiService } from '../api/api'
import { ActivatedRoute } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { Clipboard } from '@angular/cdk/clipboard'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MyVideo } from '../my-video/my-video'
import { MatDialog } from '@angular/material/dialog'
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { RoomPrepareDialog } from './room-prepare-dialog/room-prepare-dialog'
import { first, filter, tap, switchMap, takeUntil, defer } from 'rxjs'

@Component({
  selector: 'app-room',
  imports: [MatButtonModule, MyVideo],
  templateUrl: './room.html',
  styleUrl: './room.css'
})
export class Room {


  dialog = inject(MatDialog)

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
  ) {
    const enterRoomSubscribe = toObservable(this.room.value).pipe(
      filter(room => room !== undefined),
      switchMap(() => {
        return this.dialog.open(RoomPrepareDialog, {
          width: '500px',
        }).afterClosed().pipe(first())
      }),
      switchMap(currentUser => {
        return this.apiService.enterRoom(this.route.snapshot.paramMap.get('id')!, currentUser)
      }),
      takeUntilDestroyed(),
    ).subscribe(room => {
      enterRoomSubscribe.unsubscribe()
      this.room.set(room)
    })
  }

  private snackbar = inject(MatSnackBar)

  room = resource({
    params: () => ({ id: this.route.snapshot.paramMap.get('id')! }),
    loader: ({ params }) => this.apiService.getRoom(params.id),
  })

  users = computed(() => {
    return this.room.hasValue() ? this.room.value().users : []
  })

  public async copyInviteLink() {
    const inviteLink = new URL(`/rooms/${this.route.snapshot.paramMap.get('id')}/invite`, location.origin)
    inviteLink.searchParams.set('owner', this.route.snapshot.queryParams['myName'])
    if (this.clipboard.copy(inviteLink.toString())) {
      this.snackbar.open('Скопировано', undefined, {
        duration: 2000,
      })
    }
  }


}
