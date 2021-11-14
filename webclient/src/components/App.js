import './App.css';

import AreasList from './AreasList';
import { SettingsProvider } from './SettingsContext';

const getSettings = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pomodoroLength = parseInt(urlParams.get('pomodoroLength'));

  return {
    pomodoro: {
      lengthInMinutes: pomodoroLength || 25
    }
  }
}

function App({ thingsService }) {

  return (
    <div className="p-3 bg-light App">
      <span className="fs-5 fw-semibold">PomoThings</span>

      <hr />

      <main className="d-flex flex-column flex-shrink-0">
        <SettingsProvider value={getSettings()} >
          <AreasList thingsService={thingsService} />
        </SettingsProvider>
      </main>

      <hr />
    </div>
  );
}

export default App;
