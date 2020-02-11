import { createAction, createReducer } from '../src'

type State = {
  selectedId: string | null
}

const enum Actions {
  SELECT = "SELECT",
}

const selectAction = createAction(Actions.SELECT, (id: string) => ({ id }))

it('should respond to an action', () => {
  const reducer = createReducer<State>({ selectedId: null })

  reducer.on(selectAction, (_, { payload }) => {
    return {
      selectedId: payload.id,
    }
  })

  const result = reducer.handle({ selectedId: null }, selectAction('foo'))
  expect(result).toEqual({ selectedId: 'foo' })
})
