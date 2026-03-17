import type { BaseService } from '../base-service'
import type { PublicServiceAPI } from './typed-hooks'
import { createTypedHooks } from './typed-hooks'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Expect<T extends true> = T

type Services = {
  counter: BaseService<
    unknown,
    unknown,
    {
      count: number
      label?: string
    }
  > & {
    inc(by: number): number
    setLabel(label: string): void
    ping(): Promise<'pong'>
  }
}

type CounterPublic = PublicServiceAPI<Services['counter']>

type _stateIsMerged = Expect<Equal<CounterPublic['count'], number>>
type _methodsAreKept = Expect<Equal<CounterPublic['inc'], (by: number) => number>>
type _asyncMethodIsKept = Expect<Equal<CounterPublic['ping'], () => Promise<'pong'>>>

// Ensure BaseService keys do not leak into the public API
// @ts-expect-error reset must be hidden
type _noReset = CounterPublic['reset']
// @ts-expect-error subscribe must be hidden
type _noSubscribe = CounterPublic['subscribe']
// @ts-expect-error state must be hidden (its fields are merged instead)
type _noState = CounterPublic['state']
// @ts-expect-error dependencies must be hidden
type _noDependencies = CounterPublic['dependencies']
// @ts-expect-error getService must be hidden
type _noGetService = CounterPublic['getService']

// Ensure inference through createTypedHooks matches the extracted public API
const { useService } = createTypedHooks<Services>()
const counter = useService('counter')

counter.inc(1)
counter.setLabel('ok')
counter.count.toFixed(0)
void counter.ping().then((v) => v)

// @ts-expect-error reset must be absent
counter.reset()

