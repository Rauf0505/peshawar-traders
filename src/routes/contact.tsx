import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Peshawar Traders" },
      {
        name: "description",
        content:
          "Get in touch with Peshawar Traders for support, wholesale inquiries, or partnership opportunities.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <section className="py-24 md:py-32">
          <div className="container-x max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-medium text-center">
              Contact Us
            </h1>
            <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
              Have a question about a product, need assistance with an order, or want to discuss
              wholesale options? Fill the form below and we’ll get back to you within 24‑48 hours.
            </p>

            <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-medium rounded-md hover:bg-primary/90 transition"
              >
                <Mail className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
