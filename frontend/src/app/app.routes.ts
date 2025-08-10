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
  },
  {
    path: 'rooms/:id',
    loadComponent: () => import('./room/room').then(m => m.Room)
  },
  {
    path: 'rooms/:id/invite',
    loadComponent: () => import('./health-check/health-check').then(m => m.HealthCheck)
  }
]
