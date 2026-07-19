"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      window.location.href = '/user-dashboard';
    }
  };



  return (
    <main className="flex flex-col w-full min-h-screen bg-black relative items-center justify-center pt-20 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pubg-yellow/5 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black font-heading uppercase tracking-tighter text-white mb-2">
            Welcome <span className="text-pubg-yellow">Back</span>
          </h1>
          <p className="text-white/60 text-sm">Login to access your player dashboard</p>
        </motion.div>

        <Card className="p-8 border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-pubg-yellow" />
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-white/70 text-xs font-bold uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pubg-yellow transition-colors"
                  placeholder="player@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-xs font-bold uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pubg-yellow transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" glow className="w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                </span>
              ) : (
                "LOGIN SECURELY"
              )}
            </Button>
          </form>



          <p className="text-center text-white/50 text-xs mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/registration" className="text-pubg-yellow font-bold hover:underline">
              Register Now
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
