import * as React from 'react'
import { inject } from 'mobx-react'

import Loading from './Loading/Loading'

interface IAppProps {
  loading?: boolean
}

interface IAppFullProps {
  loading: boolean
}

const App = ({ loading }: IAppProps | IAppFullProps) => (
  <>
    {loading ? <Loading /> : null}
  </>
)

export { App as BaseApp }

export default inject(({ gameStateStore }) => ({
  loading: gameStateStore
}))(App)
