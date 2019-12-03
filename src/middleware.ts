import { Dispatch, Middleware } from 'redux'
import { ActionHandlers, ActionHandlerSet } from './actionHandlers'

/** Redux Middleware that allows you to dispatch an async action */
export const createActionHandlerMiddleware: <C, S>(
  context: C,
  handlers: ActionHandlers<C, S>[]
) => Middleware<{}, S, Dispatch> = (context, handlers) => {
  const allHandlers = mergeActionHandlers(handlers)
  return redux => next => action => {
    const nextState = next(action)
    const handlers = allHandlers[action.type]

    if (handlers !== undefined) {
      handlers.forEach(handler => handler({ context, redux, action }))
    }

    return nextState
  }
}

/** Merge multiple action handlers into a single object  */
function mergeActionHandlers<C, S>(
  handlers: ActionHandlers<C, S>[]
): ActionHandlerSet<C, S> {
  const allHandlers: ActionHandlerSet<C, S> = {}

  handlers.forEach(group => {
    Object.keys(group.handlers).forEach(actionTypeString => {
      const actionType = parseInt(actionTypeString)
      const handler = group.handlers[actionType]
      const existingHandlers = allHandlers[actionType]
      if (existingHandlers) {
        existingHandlers.push(group.handlers[actionType])
      } else {
        allHandlers[actionType] = [handler]
      }
    })
  })

  return allHandlers
}
