import { Component, effect, ElementRef, input, resource, ViewChild } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { toObservable } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-my-video',
  imports: [MatProgressSpinnerModule],
  templateUrl: './my-video.html',
  styleUrl: './my-video.css'
})
export class MyVideo {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>

  audio = input(false)
  video = input(false)

  videoStream = resource({
    params: () => ({
      enabled: this.video()
    }),
    loader: ({ params }) => params.enabled ? navigator.mediaDevices.getUserMedia({ video: true }) : Promise.resolve(null)
  })

  audioStream = resource({
    params: () => ({
      enabled: this.audio()
    }),
    loader: ({ params }) => params.enabled ? navigator.mediaDevices.getUserMedia({ audio: true }) : Promise.resolve(null)
  })


  constructor() {
    toObservable(this.videoStream.value).pipe(

    ).subscribe(stream => {
      if (this.videoElement && this.videoElement.nativeElement && stream) {
        this.videoElement.nativeElement.srcObject = stream
      } else if (this.videoElement && this.videoElement.nativeElement && stream === null) {
        this.videoElement.nativeElement.srcObject = null
      }
    })
  }
}
