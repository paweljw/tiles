import * as React from 'react'
import './Menu.scss'
import { observer, inject } from 'mobx-react'

interface IMenuProps {
  onOpenDevTools: (event: React.MouseEvent<HTMLButtonElement>) => void
  onExitGame: (event: React.MouseEvent<HTMLButtonElement>) => void
  toggleFullScreen: () => void
  isDev: boolean
  keysUp: string[]
  keysDown: string[]
  keysRight: string[]
  keysLeft: string[]
  keysFire: string[]
  setKey: (key: string, index: number, to: string) => void
}

interface IMenuState {
  keyboardOpen: boolean
  setting: null | string
  settingIndex: null | number
}

const displayKey = (key: string | null): string => {
  if (!key) {
    return 'None'
  }
  if (key === ' ') {
    return 'Spacebar'
  }
  return key.replace('Key', '').replace('Arrow', '')
}

@observer
class Menu extends React.Component<IMenuProps> {
  public state: IMenuState = {
    keyboardOpen: false,
    setting: null,
    settingIndex: null,
  }

  public render() {
    const {
      onOpenDevTools,
      onExitGame,
      toggleFullScreen,
      isDev,
      keysUp,
      keysDown,
      keysLeft,
      keysRight,
      keysFire,
      setKey,
    } = this.props
    const { keyboardOpen, setting, settingIndex } = this.state

    return (
      <div className='Menu'>
        <h1>- PAUSED -</h1>
        {!keyboardOpen && (
          <>
            {isDev && (
              <button className='button' onClick={onOpenDevTools}>
                Open DevTools
              </button>
            )}
            <button className='button' onClick={toggleFullScreen}>
              Toggle Fullscreen
            </button>
            <button className='button' onClick={this.openKeyboard}>
              Key bindings
            </button>
            <button className='button' onClick={onExitGame}>
              Exit Game
            </button>
          </>
        )}
        {keyboardOpen && (
          <div className='keyboard'>
            <div className='keyboard__row'>
              <div className='keyboard__option'>Up</div>
              <button
                onClick={() => this.beginSetting('keysUp', 0)}
                className='keyboard__button'
              >
                {setting === 'keysUp' && settingIndex === 0
                  ? 'Setting...'
                  : displayKey(keysUp[0])}
              </button>
              <button
                onClick={() => this.beginSetting('keysUp', 1)}
                className='keyboard__button'
              >
                {setting === 'keysUp' && settingIndex === 1
                  ? 'Setting...'
                  : displayKey(keysUp[1])}
              </button>
            </div>
            <div className='keyboard__row'>
              <div className='keyboard__option'>Down</div>
              <button
                onClick={() => this.beginSetting('keysDown', 0)}
                className='keyboard__button'
              >
                {setting === 'keysDown' && settingIndex === 0
                  ? 'Setting...'
                  : displayKey(keysDown[0])}
              </button>
              <button
                onClick={() => this.beginSetting('keysDown', 1)}
                className='keyboard__button'
              >
                {setting === 'keysDown' && settingIndex === 1
                  ? 'Setting...'
                  : displayKey(keysDown[1])}
              </button>
            </div>
            <div className='keyboard__row'>
              <div className='keyboard__option'>Left</div>
              <button
                onClick={() => this.beginSetting('keysLeft', 0)}
                className='keyboard__button'
              >
                {setting === 'keysLeft' && settingIndex === 0
                  ? 'Setting...'
                  : displayKey(keysLeft[0])}
              </button>
              <button
                onClick={() => this.beginSetting('keysLeft', 1)}
                className='keyboard__button'
              >
                {setting === 'keysLeft' && settingIndex === 1
                  ? 'Setting...'
                  : displayKey(keysLeft[1])}
              </button>
            </div>
            <div className='keyboard__row'>
              <div className='keyboard__option'>Right</div>
              <button
                onClick={() => this.beginSetting('keysRight', 0)}
                className='keyboard__button'
              >
                {setting === 'keysRight' && settingIndex === 0
                  ? 'Setting...'
                  : displayKey(keysRight[0])}
              </button>
              <button
                onClick={() => this.beginSetting('keysRight', 1)}
                className='keyboard__button'
              >
                {setting === 'keysRight' && settingIndex === 1
                  ? 'Setting...'
                  : displayKey(keysRight[1])}
              </button>
            </div>
            <div className='keyboard__row'>
              <div className='keyboard__option'>Fire</div>
              <button
                onClick={() => this.beginSetting('keysFire', 0)}
                className='keyboard__button'
              >
                {setting === 'keysFire' && settingIndex === 0
                  ? 'Setting...'
                  : displayKey(keysFire[0])}
              </button>
              <button
                onClick={() => this.beginSetting('keysFire', 1)}
                className='keyboard__button'
              >
                {setting === 'keysFire' && settingIndex === 1
                  ? 'Setting...'
                  : displayKey(keysFire[1])}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  private openKeyboard = () => {
    this.setState({ keyboardOpen: true })
  }

  private beginSetting = (key: string, index: number) => {
    this.setState({ setting: key, settingIndex: index })
    window.addEventListener('keydown', this.finishSetting)
  }

  private finishSetting = event => {
    const { setKey } = this.props
    const { setting, settingIndex } = this.state

    setKey(setting, settingIndex, event.code)

    this.setState({ setting: null, settingIndex: null })

    window.removeEventListener('keydown', this.finishSetting)

    event.stopPropagation()
    event.preventDefault()
  }
}

export default inject(({ settingsStore }) => ({
  keysUp: settingsStore.keysUp,
  keysDown: settingsStore.keysDown,
  keysLeft: settingsStore.keysLeft,
  keysRight: settingsStore.keysRight,
  keysFire: settingsStore.keysFire,
  setKey: settingsStore.setKey,
}))(Menu)
