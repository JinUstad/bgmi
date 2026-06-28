import Link from "next/link";
import { Crosshair, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <Crosshair className="h-8 w-8 text-pubg-yellow transition-transform duration-300 group-hover:rotate-90" />
              <span className="font-heading text-2xl font-black uppercase tracking-wider text-white">
                BGMI<span className="text-pubg-yellow text-glow">ESPORTS</span>
              </span>
            </Link>
            <p className="text-white/90 mb-6 max-w-sm">
              India's premium battleground for elite players. Join the ultimate BGMI tournaments, prove your skills, and win massive cash prizes.
            </p>
            <div className="flex gap-4 items-center">
              <Share2 className="w-5 h-5 text-pubg-yellow mr-2" />
              <a href="#" className="font-bold text-sm uppercase tracking-widest text-white/80 hover:text-pubg-yellow transition-colors">
                YouTube
              </a>
              <span className="text-white/20">|</span>
              <a href="#" className="font-bold text-sm uppercase tracking-widest text-white/80 hover:text-pubg-yellow transition-colors">
                Instagram
              </a>
              <span className="text-white/20">|</span>
              <a href="#" className="font-bold text-sm uppercase tracking-widest text-white/80 hover:text-pubg-yellow transition-colors">
                Discord
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-pubg-yellow mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white/90 font-medium hover:text-pubg-yellow transition-colors">Home</Link></li>
              <li><Link href="/tournaments" className="text-white/90 font-medium hover:text-pubg-yellow transition-colors">Tournaments</Link></li>
              <li><Link href="/contact" className="text-white/90 font-medium hover:text-pubg-yellow transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="text-white/90 font-medium hover:text-pubg-yellow transition-colors">About Platform</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-pubg-yellow mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-white/90 font-medium hover:text-pubg-yellow transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="text-white/90 font-medium hover:text-pubg-yellow transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/90 font-medium hover:text-pubg-yellow transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} BGMI Esports. All rights reserved.
          </p>
          <p className="text-white/50 text-xs">
            Design by <a href="https://www.devfordevs.in/" target="_blank" rel="noopener noreferrer" className="text-pubg-yellow hover:underline font-bold">DevforDevs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
