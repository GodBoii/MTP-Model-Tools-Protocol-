import { TextReveal } from "@/components/TextReveal";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="page-shell contact-page">
      <section className="contact-hero">
        <TextReveal text="Tell us what broke, or what you want to build." as="h1" />
        <p>MTPX integration help, provider setup, tool registries, runtime traces, sessions, approval gates, MCP bridges, and production hardening.</p>
      </section>
      <ContactForm />
    </main>
  );
}
