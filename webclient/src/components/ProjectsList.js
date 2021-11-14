import React, { useEffect, useState } from 'react';

import TasksList from './TasksList';
import ListRow from './ListRow';

function ProjectsList({ areaId, thingsService }) {

  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(false)

  useEffect(() => {
    thingsService.callResultsToState(
      () => thingsService.getProjectsByArea(areaId),
      setProjects
    );
  }, [areaId, thingsService]);

  return (
    <ul className="nav nav-pills projects-list">
      {projects.map((project) =>
        <ListRow
          uuid={project.uuid}
          title={project.title}
          selected={project.uuid === selectedProject}
          onClick={() => {
            project.uuid === selectedProject ?
              setSelectedProject(null) :
              setSelectedProject(project.uuid);
          }}
          onSelected={() => 
            <TasksList projectId={project.uuid} thingsService={thingsService} />
          }
        />
      )}
    </ul>
  );
}

export default ProjectsList;
