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
import { first, filter, iif, from, distinct, of, tap, map, forkJoin, switchMap, defer, scan } from 'rxjs'
import { MatIconModule } from '@angular/material/icon'
import { Channel, Socket } from 'phoenix'
import { channel } from 'node:process'

@Component({
  selector: 'app-room',
  imports: [MatButtonModule, MyVideo, MatIconModule],
  templateUrl: './room.html',
  styleUrl: './room.css'
})
export class Room {


  socket = new Socket('ws://localhost:4000/socket')

  dialog = inject(MatDialog)

  enableMicro = signal(false)
  enableVideo = signal(false)
  private pcs = signal<{pc: RTCPeerConnection, user: { name: string, uid: string }}[]>([])
  private remoteVideos = signal<MediaStreamTrack[]>([])
  private channel: Channel | null = null

  private pc$ = toObservable(this.pcs).pipe(
    switchMap(pcs => from(pcs)),
    distinct(),
    tap(async ({ pc, user }) => {
      const offer = await pc.createOffer()
      pc.setLocalDescription(offer)
      this.channel!.push('offer', { type: offer.type, sdp: offer.sdp, to: user.uid })
    })
  ).subscribe(pc => {

    // console.info(pc)
  })

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
  ) {
    const roomId = this.route.snapshot.paramMap.get('id')!
    this.socket.connect()
    this.channel = this.socket.channel("room:" + roomId, {})
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })

    this.channel.on("offer", console.info)

    toObservable(this.room.value).pipe(
      filter(room => room !== undefined),
      switchMap(room => iif(
        () => !!sessionStorage.getItem(room.uid),
        of(JSON.parse(sessionStorage.getItem(room.uid)!)),
        defer(() => this.dialog.open(RoomPrepareDialog, {
            width: '500px',
        }).afterClosed().pipe(first(), map(user => ({ room, user }))))
      )),
      switchMap(({ user }) => forkJoin({
        user: of(user),
        room: this.apiService.enterRoom(this.route.snapshot.paramMap.get('id')!, user)
      })),
      takeUntilDestroyed(),
      first()
    ).subscribe(({ user, room }) => {
      this.room.set(room)
      this.pcs.set(
        this.room.value()!.users.map((user) => ({ pc: new RTCPeerConnection(), user }))
      )
      sessionStorage.setItem(room.uid, JSON.stringify({ user, room }))
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
