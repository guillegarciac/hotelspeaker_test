// pages/list-establishments.tsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Establishment } from "../types";
import Link from 'next/link';
import styles from '../styles/ListEstablishments.module.css';
import { useRouter } from 'next/router';

const ListEstablishments: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        const response = await fetch('/api/getAllEstablishments');
        if (!response.ok) {
          throw new Error('Failed to fetch establishments');
        }
        const data = await response.json() as Establishment[];
        setEstablishments(data);
      } catch (error) {
        console.error('Error fetching establishments:', error);
      }
    };
    fetchEstablishments();
  }, []);

  const handleSelectEstablishment = (id: string) => {
    setSelectedEstablishmentId(id);  
    router.push(`/submit-review?establishmentId=${id}`); 
  };

  return (
    <>
      <Head>
        <title>List Establishments</title>
        <meta name="description" content="View all establishments" />
      </Head>
      <main className={styles.container}>
        <h1>List of Establishments</h1>
        <div className={styles.cardContainer}>
          {establishments.map(establishment => (
            <div 
              key={establishment.id} 
              className={styles.card} 
              onClick={() => handleSelectEstablishment(establishment.id)}
            >
              <h2>{establishment.name}</h2>
              <p>ID: {establishment.id}</p>
            </div>
          ))}
        </div>
        {selectedEstablishmentId && (
          <div className={styles.selectedEstablishment}>
            <p>Selected Establishment ID: {selectedEstablishmentId}</p>
            <Link href={`/submit-review?establishmentId=${selectedEstablishmentId}`} className={styles.link}>
              Submit a Review for this Establishment
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default ListEstablishments;
