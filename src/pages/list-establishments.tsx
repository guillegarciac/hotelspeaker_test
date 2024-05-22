import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Establishment } from "../types";
import Link from 'next/link';

const ListEstablishments: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstablishments = async () => {
      const response = await fetch('/api/getAllEstablishments');
      const data = await response.json() as Establishment[];
      setEstablishments(data);
    };
    fetchEstablishments();
  }, []);

  const handleSelectEstablishment = (id: string) => {
    setSelectedEstablishmentId(id);  // Store the selected ID or do something with it
  };

  return (
    <>
      <Head>
        <title>List Establishments</title>
        <meta name="description" content="View all establishments" />
      </Head>
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>List of Establishments</h1>
        <ul>
          {establishments.map(establishment => (
            <li key={establishment.id} style={{ cursor: 'pointer' }}>
              <div onClick={() => handleSelectEstablishment(establishment.id)}>
                {establishment.name}
              </div>
            </li>
          ))}
        </ul>
        {selectedEstablishmentId && (
          <div>
            <p>Selected Establishment ID: {selectedEstablishmentId}</p>
            <Link href={`/submit-review?establishmentId=${selectedEstablishmentId}`}>
              Submit a Review for this Establishment
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default ListEstablishments;
