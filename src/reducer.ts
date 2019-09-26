import { Action, ActionCreator } from './actions'

/** Reducers respond to actions and update the app's state */
class Reducer<S> {
  private initialState: S
  private handlers: {
    [key: string]: (state: S, action: Action<any>) => S
  } = {}

  constructor(initialState: S) {
    this.initialState = initialState
  }

  on = <P>(
    actionCreator: ActionCreator<P>,
    updateState: (state: S, action: Action<P>) => S
  ): this => {
    this.handlers[actionCreator.type] = updateState
    return this
  }

  handle = (state: S | undefined, action: Action<any>): S => {
    const handler = this.handlers[action.type]
    if (state && handler) {
      return handler(state, action)
    } else if (state) {
      return state
    } else {
      return this.initialState
    }
  }
}

/** Syntactic sugar for creating reducers */
export function createReducer<S>(initialState: S): Reducer<S> {
  return new Reducer(initialState)
}
