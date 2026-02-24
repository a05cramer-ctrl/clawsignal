import styles from './Tokenomics.module.css'

export default function Tokenomics() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLogo}>
          <span className={styles.footerLogoIcon}>◈</span>
          <span>CLAWSIGNAL</span>
        </div>
        <div className={styles.footerLinks}>
          <a href="https://x.com/clawsignal_dev" target="_blank" rel="noopener noreferrer">Twitter / X</a>
        </div>
        <span className={styles.footerMono}>SIGNAL ACTIVE — © 2025 CLAWSIGNAL</span>
      </div>
    </footer>
  )
}
