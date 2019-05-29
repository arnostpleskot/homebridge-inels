import R from 'ramda'
import { IAccessory } from '../types'

export const findInRegisteredAccessories = (arrayOfAccessories: IAccessory[], id: string): IAccessory | undefined =>
  R.compose(R.find(R.pathEq(['context', 'id'], id)))(arrayOfAccessories)
