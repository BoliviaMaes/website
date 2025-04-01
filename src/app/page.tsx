import Image from "next/image";
import styles from "./page.module.css";
import Ministros from "@/components/Ministros";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        <h1>Bolivia</h1>
        <p>
          Directorio de ministros, viceministros y autoridades del Estado
          Plurinacional de Bolivia
        </p>
      </header>
      <main className={styles.main}>
        <Ministros></Ministros>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/BoliviaMaes/bolivia-maes"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Datos
        </a>
      </footer>
    </div>
  );
}
