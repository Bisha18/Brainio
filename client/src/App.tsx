import './App.css'
import {Button} from './components/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'

function App() {
  return(
    <div>
      <Button startIcon={<PlusIcon size="md"/>} variant='primary' text="share" size="lg"/>
       <Button startIcon={<ShareIcon size="md"/>} variant='secondary' text="Add me" size="lg"/>
    </div>
  )
}

export default App
