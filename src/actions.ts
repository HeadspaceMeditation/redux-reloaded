/** Utils for creating type-safe Redux reducers and action creators  */

/**  A Redux action's type. We assume all action types
 *   are expressed as Enums, hence the alias to number
 */
export type ActionType = number

/** A Redux action */
export interface Action<P> {
  readonly type: ActionType
  readonly payload: P
}

/** A Redux action creattor - i.e. a function that returns an Action */
export interface ActionCreator<P> {
  (args: any): Action<P>
  readonly type: ActionType
}

/** Syntactic sugar for creating actions */
export function createAction<T extends ActionType, P>(
  type: T,
  payload: (args: any) => P
): ActionCreator<P> {
  const f = (args: any) => ({ type, payload: payload(args) })
  f.type = type
  return f
}
