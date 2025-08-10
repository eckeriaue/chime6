import { RenderMode, ServerRoute } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'rooms/create',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'rooms/:id',
    renderMode: RenderMode.Server,
  }
]
