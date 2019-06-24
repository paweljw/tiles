// TODO: Support non-Workman layout and configurability

class ConfigManager {
  static get KeysUp(): string[] {
    return ['ArrowUp', 'KeyD']
  }

  static get KeysDown(): string[] {
    return ['ArrowDown', 'KeyS']
  }

  static get KeysLeft(): string[] {
    return ['ArrowLeft', 'KeyA']
  }

  static get KeysRight(): string[] {
    return ['ArrowRight', 'KeyH']
  }
}

export default ConfigManager
