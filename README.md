# Redux Reloaded

![advertisement](https://raw.githubusercontent.com/ginger-io/redux-reloaded/master/advertisement.jpg)

## What's this?

Typesafe Redux, without all the boilerplate...and more.

## Features

### Less Boilerplate

```TypeScript

import { createAction, createReducer } from "redux-reloaded"

/** Define all your actions in an Enum  */
export enum Actions {
  SELECT_PATIENT
}

/**  Create what Redux calls an "Action Creator" - i.e. a function that returns an action  */
export const selectPatient = createAction(
  Actions.SELECT_PATIENT,
  (id: string) => ({
    patientId: id
  })
)


/** Create a reducer that operates on State, with some initial state */
type State = {}
export const reducer = createReducer<State>({
  selectedPatientId: null
})

/** And when we see the selectPatient action, update our State... */
reducer.on(selectPatient, (state, { payload }) => ({
  ...state,
  selectedPatientId: payload.patientId
}))
```

### Async Action Handlers

Often you want to take some async action based on a Redux event - e.g. call an API, wait for the response
and update the UI at a later time. That's what redux-thunk and redux-saga are for.

But both of those options have their tradeoffs. redux-reloaded aims to be easy to use and simple to test. It's just like DOM event-listeners, but for Redux events. You bind a "handler" to your event, and it runs every time that event is triggered.


```TypeScript

import { createActionHandlers, createActionHandlerMiddleware } from "redux-reloaded"
import { applyMiddleware, createStore } from "redux"

// Stick objects you want your async acion your services
type Services = {
    apiClient: APIClient
}

const services: Services = ...

type State = {
}

export const actionHandlers = createActionHandlers<Services, State>()
actionHandlers.on(selectPatient, async ({ action, context, redux }) => {
    const foo = await context.apiClient.getFoo()
    redux.dispatch(...)
})


export const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(
    createActionHandlerMiddleware({ services }, [actionHandlers])
  )
)
```