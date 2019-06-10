// TODO: Support non-Workman layout and configurability

class ConfigManager {
  static get KeysUp (): Array<string> {
    return ['ArrowUp', 'KeyD'];
  }

  static get KeysDown (): Array<string> {
    return ['ArrowDown', 'KeyS'];
  }

  static get KeysLeft (): Array<string> {
    return ['ArrowLeft', 'KeyA'];
  }

  static get KeysRight (): Array<string> {
    return ['ArrowRight', 'KeyH'];
  }
}

export default ConfigManager;