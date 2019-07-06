import * as React from 'react'
import './Menu.scss'
import { observer, inject } from 'mobx-react'
import KeyboardRow from './KeyboardRow/KeyboardRow';

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
            <KeyboardRow
              settingFirst={setting === 'keysUp' && settingIndex === 0}
              settingSecond={setting === 'keysUp' && settingIndex === 1}
              label='Up'
              keyType='keysUp'
              callback={this.beginSetting}
              keys={keysUp} />
            <KeyboardRow
              settingFirst={setting === 'keysDown' && settingIndex === 0}
              settingSecond={setting === 'keysDown' && settingIndex === 1}
              label='Down'
              keyType='keysDown'
              callback={this.beginSetting}
              keys={keysDown} />
            <KeyboardRow
              settingFirst={setting === 'keysLeft' && settingIndex === 0}
              settingSecond={setting === 'keysLeft' && settingIndex === 1}
              label='Left'
              keyType='keysLeft'
              callback={this.beginSetting}
              keys={keysLeft} />
            <KeyboardRow
              settingFirst={setting === 'keysRight' && settingIndex === 0}
              settingSecond={setting === 'keysRight' && settingIndex === 1}
              label='Right'
              keyType='keysRight'
              callback={this.beginSetting}
              keys={keysRight} />
            <KeyboardRow
              settingFirst={setting === 'keysFire' && settingIndex === 0}
              settingSecond={setting === 'keysFire' && settingIndex === 1}
              label='Attack'
              keyType='keysFire'
              callback={this.beginSetting}
              keys={keysFire} />
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
