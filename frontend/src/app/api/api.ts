import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient)
  private apiUrl = new URL(`http://${env('BACKEND_HOST')}:${env('BACKEND_PORT')}`)
  private createRoomApiUrl = new URL('/api/v1/rooms/create', this.apiUrl.toString())
  createRoom(options: any) {
    return this.http.post(this.createRoomApiUrl.toString(), {
      body: options,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
