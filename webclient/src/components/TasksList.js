import React, { useEffect, useState, useContext } from 'react';

import SettingsContext from './SettingsContext';
import { sendNotifications } from '../notifications';

import PomodoroTimer from './PomodoroTimer';
import ListRow from './ListRow';

function TasksList({ projectId, thingsService }) {

  const settings = useContext(SettingsContext)

  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(false)

  useEffect(() => {
    thingsService.callResultsToState(
      () => thingsService.getTasksByProject(projectId),
      setTasks
    )
  }, [projectId, thingsService]);

  const onTimerComplete = async ({ uuid }) => {
    sendNotifications(`🍅 PomoThings timer for has finished!`);
    await thingsService.tagTask(uuid);
  }

  return (
    <ul className="nav nav-pills tasks-list">
      {tasks.map((task) =>
        <ListRow
          uuid={task.uuid}
          title={task.title}
          selected={task.uuid === selectedTask}
          ignoreSelectedStyle={true}
          onClick={() => setSelectedTask(task.uuid)}
          onSelected={() =>
            <PomodoroTimer
              lengthInMinutes={settings.pomodoro.lengthInMinutes}
              onComplete={() => onTimerComplete(task)}
              className="ms-3"
            />
          }
        />
      )}
    </ul>
  );
}

export default TasksList;
