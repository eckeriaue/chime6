import { Routes } from '@angular/router'
import { Hub } from './hub/hub'

export const routes: Routes = [
  {
    path: '',
    component: Hub
  },
  {
    path: 'rooms/create',
    loadComponent: () => import('./create-room/create-room').then(m => m.CreateRoom)
  }
]
