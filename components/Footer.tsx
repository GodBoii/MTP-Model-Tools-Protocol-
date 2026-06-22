import Link from "next/link";
import { installCommand, navItems } from "@/content/site";

export function Footer() {
  return (
    <footer className="footer">
      <Link href="/" className="footer__brand">mtpx</Link>
      <nav>
        {navItems.map((item) => (
          <Link className="link-line" href={item.href} key={item.href}>{item.label}</Link>
        ))}
      </nav>
      <div>
        <p>(c)mtp 2026</p>
        <p>{installCommand}</p>
      </div>
      <div className="footer__social">runtime docs<br />provider guides<br />safety notes</div>
    </footer>
  );
}
