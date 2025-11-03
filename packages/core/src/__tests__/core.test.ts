import { Core, BaseService } from '../index'

class CounterService extends BaseService<Services, Dependencies> {
  state = { count: 0 }

  init() {
    this.state.count = 0
  }

  increment() {
    this.state.count = this.state.count + 1
  }

  getCount() {
    return this.state.count
  }
}

class CalculatorService extends BaseService<Services, Dependencies> {
  state = { result: 0 }

  add(a: number, b: number) {
    this.state.result = a + b
    return this.state.result
  }

  incrementCounter() {
    const counterService = this.getService('counter') as any
    counterService.increment()
    return counterService.getCount()
  }

  getResult() {
    return this.state.result
  }
}

class LoggerService extends BaseService<Services, Dependencies> {
  state = { logs: [] as string[] }

  log(message: string) {
    this.state.logs.push(message)
  }

  logWithPrefix(message: string) {
    const prefix = this.dependencies.prefix || 'LOG'
    this.log(`${prefix}: ${message}`)
  }

  getLogs() {
    return this.state.logs
  }
}

class AsyncService extends BaseService<Services, Dependencies> {
  state = { initialized: false, data: null as any }

  async init() {
    await new Promise(resolve => setTimeout(resolve, 10))
    this.state.initialized = true
    this.state.data = 'async data'
  }

  getStatus() {
    return { initialized: this.state.initialized, data: this.state.data }
  }
}

class StatelessService extends BaseService<Services, Dependencies> {
  private value = 0

  increment() {
    this.value++
  }

  getValue() {
    return this.value
  }
}

type Services = {
  counter: typeof CounterService
  calculator: typeof CalculatorService
  logger: typeof LoggerService
  async: typeof AsyncService
  stateless: typeof StatelessService
}

type Dependencies = {
  prefix: string
  version: string
}

describe('Core', () => {
  let core: Core<Services, Dependencies>

  beforeEach(() => {
    const dependencies = { prefix: 'TEST', version: '1.0.0' }
    const services = { 
      counter: CounterService, 
      calculator: CalculatorService, 
      logger: LoggerService,
      async: AsyncService,
      stateless: StatelessService
    }
    core = new Core(dependencies, services)
  })

  it('should initialize services', () => {
    expect(core.services.counter).toBeDefined()
    expect(core.services.calculator).toBeDefined()
    expect(core.services.logger).toBeDefined()
    expect(core.services.async).toBeDefined()
    expect(core.services.stateless).toBeDefined()
  })

  it('should increment counter', () => {
    core.services.counter.increment()
    expect(core.services.counter.getCount()).toBe(1)
  })

  it('should call method from another service', () => {
    const initialCount = core.services.counter.getCount()
    const newCount = core.services.calculator.incrementCounter()
    expect(newCount).toBe(initialCount + 1)
  })

  it('should access dependencies', () => {
    core.services.logger.logWithPrefix('Hello')
    expect(core.services.logger.getLogs()).toContain('TEST: Hello')
  })

  it('should work with subscriptions', async () => {
    let lastCount = -1
    let subscriptionCalled = false
    
    const unsubscribe = core.services.counter.subscribe((state: any) => {
      lastCount = state.count
      subscriptionCalled = true
    })

    expect(lastCount).toBe(-1)
    expect(subscriptionCalled).toBe(false)
    
    const initialCount = core.services.counter.getCount()
    core.services.counter.increment()
    const newCount = core.services.counter.getCount()
    
    expect(newCount).toBe(initialCount + 1)
    
    await new Promise(resolve => setTimeout(resolve, 10))
    
    expect(subscriptionCalled).toBe(true)
    expect(lastCount).toBe(newCount)

    unsubscribe()
  })

  it('should handle async service initialization', async () => {
    await new Promise(resolve => setTimeout(resolve, 20))
    
    const status = core.services.async.getStatus()
    expect(status.initialized).toBe(true)
    expect(status.data).toBe('async data')
  })

  it('should reset service state', () => {
    core.services.counter.increment()
    expect(core.services.counter.getCount()).toBe(1)
    core.services.counter.reset()
    expect(core.services.counter.getCount()).toBe(0)
  })

  it('should bind service methods correctly', () => {
    const boundMethod = core.services.counter.increment
    const anotherBoundMethod = core.services.calculator.add
    
    expect(typeof boundMethod).toBe('function')
    expect(typeof anotherBoundMethod).toBe('function')
    
    boundMethod()
    expect(core.services.counter.getCount()).toBe(1)
  })

  it('should provide access to dependencies', () => {
    expect(core.dependencies.prefix).toBe('TEST')
    expect(core.dependencies.version).toBe('1.0.0')
  })

  it('should get service by name', () => {
    const counterService = core.getService('counter')
    expect(counterService).toBe(core.services.counter)
    
    const calculatorService = core.getService('calculator')
    expect(calculatorService).toBe(core.services.calculator)
  })

  it('should handle stateless services', () => {
    core.services.stateless.increment()
    core.services.stateless.increment()
    expect(core.services.stateless.getValue()).toBe(2)
  })

  it('should maintain service state isolation', () => {
    const initialCounterCount = core.services.calculator.getResult()
    core.services.counter.increment()
    
    expect(core.services.counter.getCount()).toBe(1)
    expect(core.services.calculator.getResult()).toBe(initialCounterCount)
  })
})

describe('BaseService', () => {
  class TestService extends BaseService<{}, Dependencies, { count: number }> {
    state = { count: 0 }

    getDependencies() {
      return this.dependencies
    }

    testSetState(count: number) {
      this.setState({ count })
    }

    testGetState() {
      return this.getState()
    }
  }

  let service: TestService
  let dependencies: Dependencies

  beforeEach(() => {
    dependencies = { prefix: 'TEST', version: '1.0.0' }
    service = new TestService(dependencies)
  })

  it('should have access to dependencies', () => {
    const deps = service.getDependencies()
    expect(deps.prefix).toBe('TEST')
    expect(deps.version).toBe('1.0.0')
  })

  it('should handle setState correctly', () => {
    service.testSetState(42)
    expect(service.state.count).toBe(42)
  })

  it('should handle getState correctly', () => {
    service.testSetState(100)
    const state = service.testGetState()
    expect(state.count).toBe(100)
  })

  it('should handle subscription without state gracefully', () => {
    const statelessService = new StatelessService(dependencies)
    const unsubscribe = statelessService.subscribe(() => {})
    expect(typeof unsubscribe).toBe('function')
    
    unsubscribe()
  })
})

describe('Core Error Handling', () => {
  it('should handle services without init method', () => {
    class NoInitService extends BaseService<{}, {}> {
      state = { value: 'test' }
    }

    const services = { noInit: NoInitService }
    const dependencies = {}
    
    expect(() => {
      new Core(dependencies, services)
    }).not.toThrow()
  })

  it('should handle services with sync init method', () => {
    class SyncInitService extends BaseService<{}, {}> {
      state = { initialized: false }

      init() {
        this.state.initialized = true
      }
    }

    const services = { syncInit: SyncInitService }
    const dependencies = {}
    
    expect(() => {
      new Core(dependencies, services)
    }).not.toThrow()
  })
})
