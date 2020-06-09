import {isMobile} from './mobile'
import {isDeve} from './development'
import Vconsole from 'vconsole'

export function showVconsole(show) {
  if (isMobile() && isDeve() && show) {
    let vConsole = new Vconsole()
  }
}
