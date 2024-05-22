import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Establishment } from '../../types'; // Ensure this is the correct path to your types

const EstablishmentDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // This gets the ID from the URL
  const [establishment, setEstablishment] = useState<Establishment | null>(null);

  useEffect(() => {
    const fetchEstablishment = async () => {
      if (typeof id === 'string') {
        const response = await fetch(`/api/getEstablishment?id=${id}`);
        const data = await response.json() as Establishment;
        setEstablishment(data);
      }
    };
    fetchEstablishment();
  }, [id]);

  if (!establishment) {
    return <div>Loading...</div>; // Show loading state or any other handling for empty data
  }

  return (
    <>
      <Head>
        <title>{establishment.name}</title>
        <meta name="description" content={`Details for ${establishment.name}`} />
      </Head>
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>{establishment.name}</h1>
        <p>ID: {establishment.id}</p>
        
        {/* Display other details as needed */}
      </main>
    </>
  );
};

export default EstablishmentDetails;
