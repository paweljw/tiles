import PixiSound from 'pixi-sound'
const Sound = PixiSound.Sound

export default class Sounds {
  private sounds: object = {}
  private loader: any

  constructor(loader: any) {
    this.loader = loader
  }

  public addSound(name: string) {
    if (this.sounds[name]) {
      return
    }

    this.sounds[name] = Sound.from(this.loader.resources[name])
  }

  public playSound(name: string, { force = false, volume = 1 } = {}) {
    const sound = this.sounds[name]

    if (!sound) {
      return
    }

    if (sound.isPlaying) {
      if (force) {
        sound.stop()
        sound.play({ volume })
      }

      return
    }

    sound.play({ volume })
  }
}
