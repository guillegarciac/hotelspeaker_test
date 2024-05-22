// pages/list-establishments.tsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Establishment } from "../types";
import styles from '../styles/ListEstablishments.module.css';

const ListEstablishments: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        const response = await fetch('/api/getAllEstablishments');
        if (!response.ok) {
          console.error('Failed to fetch establishments:', await response.text());
          return;
        }
        const data = await response.json() as Establishment[];
        setEstablishments(data);
      } catch (error) {
        console.error('Error fetching establishments:', error);
      }
    };
    fetchEstablishments();
  }, []);

  return (
    <>
      <Head>
        <title>List Establishments</title>
        <meta name="description" content="View all establishments" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.header}>List of Establishments</h1>
        <div className={styles.establishmentList}>
          {establishments.map(establishment => (
            <div key={establishment.id} className={styles.card}>
              <h2>{establishment.name}</h2>
              <p>ID: {establishment.id}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default ListEstablishments;
