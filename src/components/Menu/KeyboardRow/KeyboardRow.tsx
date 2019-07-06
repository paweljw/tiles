import * as React from 'react'

const displayKey = (key: string | null): string => {
  if (!key) {
    return 'None'
  }
  if (key === ' ') {
    return 'Spacebar'
  }
  return key.replace('Key', '').replace('Arrow', '')
}

const KeyboardRow = ({ label, keyType, callback, settingFirst, settingSecond, keys }) => {
  return (
    <div className='keyboard__row'>
      <div className='keyboard__option'>{label}</div>
      <button
        onClick={() => callback(keyType, 0)}
        className='keyboard__button'
      >
        {settingFirst
          ? 'Setting...'
          : displayKey(keys[0])}
      </button>
      <button
        onClick={() => callback(keyType, 1)}
        className='keyboard__button'
      >
        {settingSecond
          ? 'Setting...'
          : displayKey(keys[1])}
      </button>
    </div>
  )
}

export default KeyboardRow
