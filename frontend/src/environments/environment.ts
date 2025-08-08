export const environment = {
  BACKEND_PORT: 1010,
  BACKEND_HOST: 'localhost',

}

type environment = typeof environment

export function env(key: keyof environment): environment[typeof key] {
  return environment[key]
}
