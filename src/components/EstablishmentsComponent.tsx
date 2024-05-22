import React, { useState, useEffect } from 'react';
import { Establishment } from '../types';

const EstablishmentsComponent: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string>('');

  const fetchEstablishments = async () => {
    const res = await fetch('/api/getAllEstablishments');
    const data = await res.json() as Establishment[];
    setEstablishments(data);
  };

  return (
    <div>
      <button onClick={fetchEstablishments}>Load Establishments</button>
      {establishments.length > 0 && (
        <ul>
          {establishments.map((establishment) => (
            <li key={establishment.id} onClick={() => setSelectedEstablishmentId(establishment.id)}>
              {establishment.name}
            </li>
          ))}
        </ul>
      )}
      {selectedEstablishmentId && <div>Selected Establishment ID: {selectedEstablishmentId}</div>}
    </div>
  );
};

export default EstablishmentsComponent;
