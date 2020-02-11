/** Utils for creating type-safe Redux reducers and action creators  */

/**  A Redux action's type. We assume all action types
 *   are expressed as Enums, hence the alias to string
 */
export type ActionType = string

/** A Redux action */
export interface Action<P> {
  readonly type: ActionType
  readonly payload: P
}

/** A Redux action creattor - i.e. a function that returns an Action */
export interface NoPayloadActionCreator {
  (): Action<{}>
  readonly type: ActionType
}

export interface ActionCreator<T, U> {
  (args: T): Action<U>
  readonly type: ActionType
}

/** Syntactic sugar for creating actions */
export function createAction<T extends ActionType>(
  type: T
): NoPayloadActionCreator

export function createAction<T extends ActionType, U, V>(
  type: T,
  createPayload: (args: U) => V
): ActionCreator<U, V>

export function createAction<T extends ActionType, U, V>(
  type: T,
  createPayload?: (args: U) => V
): ActionCreator<U, V> | NoPayloadActionCreator {
  const createPayloadFunc =
    createPayload !== undefined
      ? (args: U) => ({ type, payload: createPayload(args) })
      : () => ({ type, payload: {} })
  return Object.assign(createPayloadFunc, { type })
}
