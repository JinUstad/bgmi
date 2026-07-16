"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Home CTA Section — Client Component
 * Extracted from page.tsx so the parent can remain a Server Component.
 */
export default function HomeCtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-pubg-yellow">
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-20"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black font-heading uppercase tracking-tighter text-black mb-6">
            Ready To Become The Next Champion?
          </h2>
          <p className="text-xl text-black/80 font-bold mb-10">
            Join thousands of players already competing for massive prize pools.
          </p>
          <Link href="/contact" aria-label="Register for the next BGMI tournament">
            <Button size="lg" className="px-8 py-4 text-lg border-2 border-black">
              Register For Next Tournament
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
