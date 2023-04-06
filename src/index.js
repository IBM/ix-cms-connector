import './styles/globals.css';

import MainHeader from './components/MainHeader/MainHeader';

export default function App() {
  const appTitle = "CMS Adapter Generator";
  return(
    <div>
      <MainHeader title={appTitle}/>
      <div class="mx-4">
        <p class="text-amber-900">Hello!</p>
      </div>
    </div>
  )
}