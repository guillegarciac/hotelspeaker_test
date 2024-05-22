import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Home - Establishment Management</title>
        <meta name="description" content="Navigate to different establishment management functionalities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.heading}>Establishment Management</h1>
        <p className={styles.description}>Select an action:</p>
        <div className={styles.linkContainer}>
          <Link href="/create-establishment" className={`${styles.link} ${styles.createLink}`}>
            Create Establishment
          </Link>
          <Link href="/list-establishments" className={`${styles.link} ${styles.listLink}`}>
            Establishments List
          </Link>
        </div>
      </main>
    </>
  );
};

export default HomePage;
