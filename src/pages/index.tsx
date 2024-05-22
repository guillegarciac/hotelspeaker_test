import Link from 'next/link';
import Head from 'next/head';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Home - Establishment Management</title>
        <meta name="description" content="Navigate to different establishment management functionalities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
        <h1>Establishment Management</h1>
        <p>Select an action:</p>
        <div style={{ margin: "20px" }}>
          <Link href="/create-establishment"
            style={{ marginRight: "20px", padding: "10px 20px", background: "blue", color: "white", textDecoration: "none" }}>Create Establishment
          </Link>
          <Link href="/list-establishments" style={{ padding: "10px 20px", background: "green", color: "white", textDecoration: "none" }}> Establishments List
          </Link>
        </div>
      </main>
    </>
  );
};

export default HomePage;