import {isMobile} from './mobile'
import {isDevelopment} from './development'
import Vconsole from 'vconsole'
export function showVconsole(show) {
  if (isMobile() && isDevelopment() && show) {
     return new Vconsole()
  }
}
