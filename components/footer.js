import Link from "next/link";
import styles from "./footer.module.css";
import { dependencies } from "../package.json";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <Link href="/privacy">
            <a>Privacy</a>
          </Link>
          <Link href="/terms">
            <a>Terms of Service</a>
          </Link>

          <a href="mailto:aksanoble@gmail.com">Contact</a>
          <Link href="https://twitter.com/aksanoble">
            <a>Twitter</a>
          </Link>
        </li>
      </ul>
    </footer>
  );
}
