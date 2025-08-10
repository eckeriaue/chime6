import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient)
  private apiUrl = new URL(`http://${env('BACKEND_HOST')}:${env('BACKEND_PORT')}`)
  private roomsApi = new URL('/api/v1/rooms/', this.apiUrl.toString())
  createRoom(options: any) {
    return this.http.post(this.roomsApi.toString(), options)
  }

  getRoom(id: string) {
    return this.http.get(`${this.roomsApi}/${id}`, {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
