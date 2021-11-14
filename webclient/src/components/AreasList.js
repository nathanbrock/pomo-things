import React, { useEffect, useState } from 'react';

import ListRow from './ListRow';
import AreaIcon from '../images/Header-Area-Template@2x.png'
import ProjectsList from './ProjectsList';

function AreasList({ thingsService }) {

  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState(false)

  useEffect(() => {
    thingsService.callResultsToState(
      thingsService.getAreas,
      setAreas
    );
  }, [thingsService]);

  return (
    <ul className="nav nav-pills w-100">
      {areas.map((area) =>
        <ListRow
          uuid={area.uuid}
          title={area.title}
          titleClassName="fw-bold"
          selected={area.uuid === selectedArea}
          onClick={() => {
            area.uuid === selectedArea ?
              setSelectedArea(null) :
              setSelectedArea(area.uuid);
          }}
          onSelected={() => 
            <ProjectsList areaId={area.uuid} thingsService={thingsService} />
          }
          buttonIcon={AreaIcon}
        />
      )}
    </ul>
  );
}

export default AreasList;
