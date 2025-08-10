import { Component, effect, ElementRef, resource, ViewChild } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-my-video',
  imports: [MatProgressSpinnerModule],
  templateUrl: './my-video.html',
  styleUrl: './my-video.css'
})
export class MyVideo {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>

  videoStream = resource({
      loader: () => navigator.mediaDevices.getUserMedia({ video: true })
  })

  audioStream = resource({
      loader: () => navigator.mediaDevices.getUserMedia({ audio: true })
  })


  constructor() {

    const effectRef = effect(() => {
      if (this.videoStream.hasValue() && this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.videoStream.value()
      }
    })
  }
}
