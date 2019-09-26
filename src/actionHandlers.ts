import { Dispatch, MiddlewareAPI } from "redux"
import { Action, ActionCreator } from "./actions"

/** A function that responds to a Redux action
 *  It might be sync or async, and may or may not
 *  choose to dispatch additional actions to Redux.
 */
export type ActionHandler<C, S, P> = (params: {
  context: C
  redux: MiddlewareAPI<Dispatch, S>
  action: Action<P>
}) => void

export type ActionHandlerSet<C, S> = {
  [key: number]: ActionHandler<C, S, any>[]
}

export class ActionHandlers<C, S> {
  public handlers: {
    [key: number]: ActionHandler<C, S, any>
  } = {}

  on = <P>(
    actionCreator: ActionCreator<P>,
    handler: ActionHandler<C, S, P>
  ): this => {
    this.handlers[actionCreator.type] = handler
    return this
  }
}

export function createActionHandlers<C, S>(): ActionHandlers<C, S> {
  return new ActionHandlers()
}
