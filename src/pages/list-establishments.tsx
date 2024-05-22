// pages/list-establishments.tsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Establishment } from "../types";

const ListEstablishments: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);

  useEffect(() => {
    const fetchEstablishments = async () => {
      const response = await fetch('/api/getAllEstablishments');
      const data = await response.json() as Establishment[];
      setEstablishments(data);
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
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>List of Establishments</h1>
        <ul>
          {establishments.map(establishment => (
            <li key={establishment.id}>
              {establishment.name} - {establishment.id}, {establishment.name}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default ListEstablishments;
