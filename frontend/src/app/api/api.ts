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

  getRoom(id: string): Promise<
    {"roomName": string,"uid": string,"users": {name: string, role: string}[] }> {
    return fetch(`${this.roomsApi}${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json()).then(JSON.parse)
  }

  getRooms(): Promise<
    {"roomName": string,"uid": string,"users": {name: string, role: string}[] }[]> {
    return fetch(`${this.roomsApi}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => {
      return r.json()
    })
  }

  getRoomUsers(id: string): Promise<
    {"roomName": string,"uid": string,"users": {name: string, role: string}[] }> {
    return fetch(`${this.roomsApi}${id}/users`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => {
      return r.json()
    })
  }
}
