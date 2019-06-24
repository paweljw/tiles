import * as React from 'react'
import { inject } from 'mobx-react'

import Loading from './Loading/Loading'

interface IAppProps {
  loading: boolean
}

const App = ({ loading }: IAppProps) => (
  <>
    {loading ? <Loading /> : null}
  </>
)

export default inject(({ gameStateStore }) => ({
  loading: gameStateStore
}))(App)
