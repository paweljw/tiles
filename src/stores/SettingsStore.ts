import { observable, action } from 'mobx'
import getConfig from '../helpers/getConfig'
import writeConfig from '../helpers/writeConfig'

export default class SettingsStore {
  @observable public keysUp: string[] = ['ArrowUp', 'KeyW']
  @observable public keysDown: string[] = ['ArrowDown', 'KeyS']
  @observable public keysLeft: string[] = ['ArrowLeft', 'KeyA']
  @observable public keysRight: string[] = ['ArrowRight', 'KeyD']
  @observable public keysFire: string[] = ['Space']
  @observable public fullScreen: boolean = false
  @observable public width: number = 1280
  @observable public height: number = 720

  @action public setKey = (key: string, index: number, to: string) => {
    const otherKeys = ['keysUp', 'keysDown', 'keysLeft', 'keysRight', 'keysFire'].map(category => {
      const ret = []

      for (let i = 0; i <= 1; i++) {
        if (!(category === key && index === i)) {
          ret.push(this[category][i])
        }
      }

      return ret
    }).flat().filter(item => item)

    if (otherKeys.some(item => item === to)) {
      return
    }

    if (key === 'keysUp') {
      this.keysUp[index] = to
    }

    if (key === 'keysDown') {
      this.keysDown[index] = to
    }

    if (key === 'keysRight') {
      this.keysRight[index] = to
    }

    if (key === 'keysLeft') {
      this.keysLeft[index] = to
    }

    if (key === 'keysFire') {
      this.keysFire[index] = to
    }

    const keyboard = {
      keysUp: this.keysUp,
      keysDown: this.keysDown,
      keysLeft: this.keysLeft,
      keysRight: this.keysRight,
      keysFire: this.keysFire
    }

    writeConfig({ ...getConfig(), keyboard })
  }
}
