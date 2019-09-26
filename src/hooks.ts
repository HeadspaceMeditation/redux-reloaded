import {
  shallowEqual,
  useDispatch as useReduxDispatch,
  useSelector,
} from 'react-redux'
import { Action } from './actions'

/** Custom Hook that lets React components consume app state */
export function useAppState<S, T>(selector: (state: S) => T): T {
  // passing shallowEqual ensures we don't force a re-render if `selector`
  // returns a new object (i.e. breaks reference equality) with equal top-level properties
  return useSelector(selector, shallowEqual)
}

/** Custom Hook that lets React compoents dispatch actions to update the state.
 *  Note we wrap the Redux dispatch() function to provide type checking
 */
export function useDispatch<P>(): (action: Action<P>) => void {
  return useReduxDispatch()
}
