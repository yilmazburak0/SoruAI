import React from "react";
import Link from "next/link";

import styles from "./styles.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="#" target="_blank">
        Burak Yılmaz
      </Link>
    </footer>
  );
}

export { Footer };
