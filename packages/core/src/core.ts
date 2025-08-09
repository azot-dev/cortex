export interface ServiceRegistry<TDependencies = Record<string, unknown>> {
  [key: string]: new (dependencies: TDependencies) => any
}

export class Core<T extends ServiceRegistry<TDependencies>, TDependencies = Record<string, unknown>> {
  private _services: { [K in keyof T]: InstanceType<T[K]> }
  private _dependencies: TDependencies

  constructor(dependencies: TDependencies, services: T) {
    this._dependencies = dependencies
    this._services = {} as { [K in keyof T]: InstanceType<T[K]> }
    
    Object.keys(services).forEach((key) => {
      const ServiceClass = services[key as keyof T]
      const service = new ServiceClass(dependencies)
      
      service.getService = this.getService.bind(this)
      
      this.bindServiceMethods(service)
      
      if ('_proxyState' in service && typeof service._proxyState === 'function') {
        service._proxyState()
      }
      
      this._services[key as keyof T] = service
    })
    
    this.initializeServices()
  }
  
  private async initializeServices(): Promise<void> {
    const initPromises: Promise<void>[] = []
    
    for (const service of Object.values(this._services)) {
      if (service && typeof service.init === 'function') {
        const result = service.init()
        if (result instanceof Promise) {
          initPromises.push(result)
        }
      }
    }
    
    if (initPromises.length > 0) {
      await Promise.all(initPromises)
    }
  }

  get services(): { [K in keyof T]: InstanceType<T[K]> } {
    return this._services
  }

  getService<K extends keyof T>(serviceName: K): InstanceType<T[K]> {
    return this._services[serviceName]
  }
  
  get dependencies(): TDependencies {
    return this._dependencies
  }

  /**
   * Automatically bind all service methods to preserve 'this' context
   */
  private bindServiceMethods(service: any): void {
    const proto = Object.getPrototypeOf(service)
    
    Object.getOwnPropertyNames(proto).forEach(name => {
      if (name === 'constructor') return
      
      const descriptor = Object.getOwnPropertyDescriptor(proto, name)
      if (descriptor && typeof descriptor.value === 'function') {
        service[name] = service[name].bind(service)
      }
    })
    
    Object.getOwnPropertyNames(service).forEach(name => {
      if (typeof service[name] === 'function' && name !== 'getService') {
        service[name] = service[name].bind(service)
      }
    })
  }
}
