import * as React from 'react'
import './Menu.scss'

interface IMenuProps {
  onOpenDevTools: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onExitGame: (event: React.MouseEvent<HTMLButtonElement>) => void,
  toggleFullScreen: () => void,
  isDev: boolean
}

const Menu = ({ onOpenDevTools, onExitGame, toggleFullScreen, isDev }: IMenuProps) =>
  <div className='Menu'>
    <h1>- PAUSED -</h1>
    {isDev && <button onClick={onOpenDevTools}>Open DevTools</button>}
    <button onClick={toggleFullScreen}>Toggle Fullscreen</button>
    <button onClick={onExitGame}>Exit Game</button>
  </div>

export default Menu
