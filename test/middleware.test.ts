import configureStore, { MockStoreEnhanced } from 'redux-mock-store'
import {
  Action,
  ActionHandlers,
  createAction,
  createActionHandlerMiddleware,
  createActionHandlers,
} from '../src/index'

// makes runAllTimers() work for tests
jest.useFakeTimers()

describe('redux middleware', () => {
  enum Actions {
    SUBMIT_FORM = "SUBMIT_FORM",
  }

  const submitForm = createAction(Actions.SUBMIT_FORM, (firstName: string) => ({
    firstName,
  }))

  it('should not blow up if an action does not have a handler registered', () => {
    const handlers = createActionHandlers()
    const store = createStore(handlers)
    const action = submitForm('foo')
    expect(() => store.dispatch(action)).not.toThrow()
  })

  it('should call a non-async handler', () => {
    const calls: Action<any>[] = []
    const handlers = createActionHandlers()

    handlers.on(submitForm, ({ action }) => {
      calls.push(action)
    })

    const store = createStore(handlers)
    const action = submitForm('foo')
    store.dispatch(action)
    expect(calls).toEqual([action])
  })

  it('should call an async handler', () => {
    const calls: Action<any>[] = []
    const handlers = createActionHandlers()

    handlers.on(submitForm, async ({ action }) => {
      await new Promise(resolve => {
        calls.push(action)
        resolve()
      })
    })

    jest.runAllTimers()

    const store = createStore(handlers)
    const action = submitForm('foo')
    store.dispatch(action)
    expect(calls).toEqual([action])
  })

  it('should support multiple handlers for the same action type', () => {
    const calls: string[] = []

    // Given a handler in file 1
    const handlers1 = createActionHandlers()
    handlers1.on(submitForm, async () => {
      await new Promise(resolve => {
        calls.push('handler-1')
        resolve()
      })
    })

    // And another handler for the same action in file 2
    const handlers2 = createActionHandlers()
    handlers2.on(submitForm, async () => {
      await new Promise(resolve => {
        calls.push('handler-2')
        resolve()
      })
    })

    // Then we should have called two actions
    const store = createStore(handlers1, handlers2)
    const action = submitForm('foo')
    store.dispatch(action)
    expect(calls).toEqual(['handler-1', 'handler-2'])
  })
})

function createStore(
  ...handlers: ActionHandlers<unknown, unknown>[]
): MockStoreEnhanced<unknown, {}> {
  const middlewares = [createActionHandlerMiddleware({}, handlers)]
  const mockStore = configureStore(middlewares)
  return mockStore({})
}
