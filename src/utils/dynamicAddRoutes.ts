import router from '@/router'

export function dynamicLoadRoutes() {
  const routes = import.meta.glob('@/router/main/**/*.ts', { eager: true })
  return routes
}

export function dynamicAddRoutes() {
  const routes: any = dynamicLoadRoutes()

  Object.keys(routes).forEach((route: any) => {
    const routeModule = routes[route].default
    router.addRoute(routeModule)
  })

  return routes
}
