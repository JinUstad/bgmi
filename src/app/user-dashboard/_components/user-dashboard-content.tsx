"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Trophy, Calendar, CheckCircle2, IndianRupee, Loader2, Gamepad2, AlertCircle, Download, MessageSquare, Copy, ShieldAlert, User, LogOut, Send, Zap, Menu, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { load } from '@cashfreepayments/cashfree-js';

export default function UserDashboardContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [matchChats, setMatchChats] = useState<any[]>([]);
  const [copiedText, setCopiedText] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'announcements' | 'upcoming'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Registration State
  const [cashfree, setCashfree] = useState<any>(null);
  const [upcomingTournament, setUpcomingTournament] = useState<any>(null);
  const [fee, setFee] = useState<number>(99);
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});
  const [registering, setRegistering] = useState(false);
  const [timeSlots, setTimeSlots] = useState<{ value: string, label: string, capacity: number }[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      let currentUser = null;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        currentUser = user;
        setAuthUser(user);
      }

      let allRegs: any[] = [];

      if (currentUser) {
        const { data: regData, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });
          
        if (!error && regData) {
          allRegs = regData;
        }
      } else if (orderId) {
        const { data: regData, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('cashfree_order_id', orderId)
          .single();
          
        if (!error && regData) {
          allRegs = [regData];
        }
      }

      setRegistrations(allRegs);

      if (allRegs.length > 0) {
        const timeSlots = [...new Set(allRegs.map(r => r.time_slot))].filter(Boolean);
        
        if (timeSlots.length > 0) {
          const { data: matches } = await supabase
            .from('matches')
            .select('id, room_id, room_password, time_slot')
            .in('time_slot', timeSlots);

          if (matches && matches.length > 0) {
            const matchIds = matches.map(m => m.id);
            const { data: chats } = await supabase
              .from('match_chats')
              .select('*')
              .in('match_id', matchIds)
              .order('created_at', { ascending: false });
              
            const enhancedChats = (chats || []).map(chat => {
              const match = matches.find(m => m.id === chat.match_id);
              return {
                ...chat,
                time_slot: match?.time_slot
              };
            });
              
            setMatchChats(enhancedChats);
          }
        }
      }

      // Load data for Upcoming tab
      const envStr = (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || '').toUpperCase();
      const cf = await load({
        mode: envStr === 'PRODUCTION' ? 'production' : 'sandbox'
      });
      setCashfree(cf);

      const { data: settingsData } = await supabase.from('settings').select('registration_fee').eq('id', 1).single();
      if (settingsData) setFee(settingsData.registration_fee);

      const { data: tournamentData } = await supabase
        .from('upcoming_tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (tournamentData && tournamentData.is_active !== false) {
        setUpcomingTournament(tournamentData);
        if (tournamentData.slots && tournamentData.slots.length > 0) {
          setTimeSlots(tournamentData.slots.map((s: any) => {
            if (typeof s === 'string') return { value: s, label: s, capacity: tournamentData.slot_capacity || 6 };
            let timeStr = s.time;
            if (s.startHour) {
              timeStr = `${s.startHour}:${s.startMin} ${s.startAmPm} - ${s.endHour}:${s.endMin} ${s.endAmPm}`;
            }
            return { value: timeStr, label: timeStr, capacity: s.capacity || tournamentData.slot_capacity || 6 };
          }));
        } else {
          setTimeSlots([]);
        }
      } else {
        setUpcomingTournament(null);
        setTimeSlots([]);
      }

      const { data: slotData } = await supabase.from('registrations').select('time_slot');
      if (slotData) {
        const counts: Record<string, number> = {};
        slotData.forEach((row: any) => {
          counts[row.time_slot] = (counts[row.time_slot] || 0) + 1;
        });
        setSlotCounts(counts);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [orderId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/registration';
  };

  const handleDashboardRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashfree) {
      alert("Payment system is initializing, please wait a moment and try again.");
      return;
    }

    setRegistering(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, any> = Object.fromEntries(formData.entries());
    
    // Auto-fill logged-in user details
    const payload: Record<string, any> = {
      ...data,
      user_id: authUser.id,
      email: authUser.email,
      tournamentType: upcomingTournament?.match_mode || 'Squad',
      message: '[DASHBOARD_REGISTRATION]\n' + (data.message || '')
    };

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.error || "Failed to create order");
      if (!orderData.payment_session_id) throw new Error(`Server returned success but no payment_session_id.`);

      let checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          alert("Payment was closed or failed. Please try again.");
          setRegistering(false);
        }
        if (result.paymentDetails) {
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderData.order_id })
          });
          const verifyData = await verifyResponse.json();

          if (verifyData.status === 'verified') {
            alert("Registration and Payment successful! Your match is now on your dashboard.");
            form.reset();
            window.location.href = `/user-dashboard?order_id=${orderData.order_id}`;
          } else {
            alert("Payment is pending or failed. Please check your status later or contact support.");
          }
          setRegistering(false);
        }
      });

    } catch (error: any) {
      console.error("Error submitting registration:", error);
      alert(`Payment error: ${error.message || 'Unknown error. Please try again.'}`);
      setRegistering(false);
    }
  };

  const handleDownloadPDF = async (reg: any) => {
    if (!reg) return;
    setDownloadingId(reg.cashfree_order_id);

    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header Background
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      // Yellow accent line
      doc.setFillColor(255, 214, 0);
      doc.rect(0, 50, pageWidth, 3, 'F');

      // Title
      doc.setTextColor(255, 214, 0);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('XYLOESPORTS', pageWidth / 2, 22, { align: 'center' });
      
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Tournament Registration Receipt', pageWidth / 2, 32, { align: 'center' });

      // Receipt ID & Date
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Receipt ID: ${reg.cashfree_order_id}`, 14, 44);
      doc.text(`Date: ${new Date(reg.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - 14, 44, { align: 'right' });

      // Player Details Table
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Player Details', 14, 65);

      autoTable(doc, {
        startY: 70,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 6,
          lineColor: [220, 220, 220],
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [40, 40, 40],
          textColor: [255, 214, 0],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          textColor: [50, 50, 50],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 55, fillColor: [245, 245, 245] },
          1: { cellWidth: 'auto' },
        },
        body: [
          ['Full Name', reg.full_name || '-'],
          ['Team Name', reg.team_name || '-'],
          ['BGMI ID', reg.bgmi_id || '-'],
          ['Mobile Number', reg.mobile_number || '-'],
          ['Email', reg.email || '-'],
          ['Tournament Type', (reg.tournament_type || '-').toUpperCase()],
          ['Time Slot', reg.time_slot || '-'],
        ],
      });

      // Payment Details Table
      const playerTableEnd = (doc as any).lastAutoTable.finalY + 12;
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 14, playerTableEnd);

      autoTable(doc, {
        startY: playerTableEnd + 5,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 6,
          lineColor: [220, 220, 220],
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [40, 40, 40],
          textColor: [255, 214, 0],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          textColor: [50, 50, 50],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 55, fillColor: [245, 245, 245] },
          1: { cellWidth: 'auto' },
        },
        body: [
          ['Order ID', reg.cashfree_order_id || '-'],
          ['Amount Paid', `Rs. ${reg.payment_amount || 0}`],
          ['Payment Status', (reg.payment_status || 'pending').toUpperCase()],
          ['Registration Date', reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'],
        ],
      });

      // Status Badge
      const paymentTableEnd = (doc as any).lastAutoTable.finalY + 15;
      const statusText = reg.payment_status === 'verified' ? 'REGISTRATION CONFIRMED' : 'PAYMENT PENDING';
      const statusColor: [number, number, number] = reg.payment_status === 'verified' ? [34, 197, 94] : [234, 179, 8];
      
      doc.setFillColor(...statusColor);
      const badgeWidth = doc.getTextWidth(statusText) * 1.5 + 20;
      doc.roundedRect((pageWidth - badgeWidth) / 2, paymentTableEnd - 6, badgeWidth, 14, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(statusText, pageWidth / 2, paymentTableEnd + 3, { align: 'center' });

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFillColor(245, 245, 245);
      doc.rect(0, footerY - 5, pageWidth, 25, 'F');
      doc.setFillColor(255, 214, 0);
      doc.rect(0, footerY - 5, pageWidth, 1.5, 'F');
      
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('This is a computer-generated receipt. No signature required.', pageWidth / 2, footerY + 3, { align: 'center' });
      doc.text('Xyloesports | support@xyloesports.in | bgmi-seven-sandy.vercel.app', pageWidth / 2, footerY + 9, { align: 'center' });

      // Save
      doc.save(`BGMI_Registration_${reg.cashfree_order_id}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pubg-yellow animate-spin" />
      </div>
    );
  }

  if (!authUser && !orderId) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-black font-heading uppercase text-white mb-4">Not Logged In</h1>
        <p className="text-white/60 text-center mb-8">Please login to view your dashboard.</p>
        <Link href="/login">
          <Button glow>Login Now</Button>
        </Link>
      </div>
    );
  }

  // Calculate stats
  const totalMatches = registrations.length;
  const verifiedMatches = registrations.filter(r => r.payment_status === 'verified');
  const totalAmountPaid = verifiedMatches.reduce((sum, r) => sum + (r.payment_amount || 0), 0);
  
  const displayData = registrations[0] || {
    full_name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Player',
    team_name: '',
    bgmi_id: '',
    mobile_number: authUser?.user_metadata?.mobile_number || '',
    upi_id: '',
  };

  let overallStatus = 'No Active Tournaments';
  if (totalMatches > 0) {
    if (verifiedMatches.length > 0) overallStatus = 'Registered';
    else overallStatus = 'Pending';
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative pb-20">
      {/* Top bar for mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#111] border-b border-white/10 sticky top-0 z-50">
         <div className="font-heading font-black text-xl text-white uppercase tracking-wider">
           Player <span className="text-pubg-yellow">Dashboard</span>
         </div>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white/70 hover:text-white">
           {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      {/* Main container */}
      <div className="flex relative z-10 max-w-[1440px] mx-auto">
          {/* Sidebar */}
          <div className={cn(
             "fixed lg:sticky top-0 lg:top-0 left-0 h-full lg:h-screen w-72 bg-[#111] lg:bg-transparent border-r border-white/10 z-40 transition-transform duration-300 lg:translate-x-0 p-6 overflow-y-auto",
             isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="hidden lg:block font-heading font-black text-2xl text-white uppercase tracking-wider mb-8">
              Player <span className="text-pubg-yellow">Dashboard</span>
            </div>
            
            <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-6 border-white/10 bg-[#111]/80 backdrop-blur-md">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={authUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${displayData.team_name || displayData.full_name}&background=random`}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full border-4 border-pubg-yellow/30 mb-4"
                  />
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">{displayData.team_name || displayData.full_name}</h3>
                  <p className="text-white/50 text-sm">{authUser?.email}</p>
                  
                  {displayData.bgmi_id && (
                    <div className="mt-6 w-full space-y-3 pt-6 border-t border-white/10 text-left">
                      <div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">BGMI ID</p>
                        <p className="text-pubg-yellow text-sm font-bold font-mono">{displayData.bgmi_id}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Contact</p>
                        <p className="text-white text-sm">{displayData.mobile_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-4 border-white/10 bg-[#111]/80 backdrop-blur-md space-y-2">
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest",
                    activeTab === 'dashboard' ? "bg-pubg-yellow text-black" : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <User className="w-5 h-5" /> Dashboard
                </button>
                <button
                  onClick={() => { setActiveTab('upcoming'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest relative overflow-hidden",
                    activeTab === 'upcoming' ? "bg-pubg-yellow text-black" : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Zap className={cn("w-5 h-5", activeTab === 'upcoming' ? "" : "text-yellow-500")} /> 
                  Upcoming Matches
                  {upcomingTournament && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab('announcements'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest",
                    activeTab === 'announcements' ? "bg-pubg-yellow text-black" : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <MessageSquare className="w-5 h-5" /> Announcements
                </button>
                <div className="h-px bg-white/10 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </Card>
            </motion.div>
          </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
             <div className="fixed inset-0 bg-black/80 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Main Content Area */}
          <div className="flex-1 p-4 lg:p-8 overflow-x-hidden min-h-screen">
            {activeTab === 'dashboard' ? (
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-pubg-yellow/10 border border-pubg-yellow/30 flex items-center justify-center shrink-0">
                    <Trophy className="w-8 h-8 text-pubg-yellow" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black font-heading uppercase text-white tracking-tighter">Overview</h1>
                    <p className="text-white/60 text-sm mt-1">Player Statistics & Match History</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="p-6 h-full flex flex-col justify-center border-white/10 bg-[#111]/80 backdrop-blur-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-green-500/10">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Status</p>
                          <p className="text-white font-bold text-xl uppercase">{overallStatus}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="p-6 h-full flex flex-col justify-center border-white/10 bg-[#111]/80 backdrop-blur-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/10">
                          <Gamepad2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Matches</p>
                          <p className="text-white font-bold text-3xl">{totalMatches}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="p-6 h-full flex flex-col justify-center border-white/10 bg-[#111]/80 backdrop-blur-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-yellow-500/10">
                          <IndianRupee className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Total Paid</p>
                          <p className="text-white font-bold text-3xl">₹{totalAmountPaid}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="p-8 border-white/10 bg-[#111]/80 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                      <h2 className="text-2xl font-black font-heading uppercase text-white">My Matches</h2>
                    </div>
                    
                    {registrations.length === 0 ? (
                      <div className="text-center py-8">
                        <Gamepad2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/50">You haven&apos;t registered for any tournaments yet.</p>
                        <Button onClick={() => setActiveTab('upcoming')} glow className="mt-4">Register For Upcoming</Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                              <th className="p-4 font-bold whitespace-nowrap">Date</th>
                              <th className="p-4 font-bold">Tournament</th>
                              <th className="p-4 font-bold">Time Slot</th>
                              <th className="p-4 font-bold">Status</th>
                              <th className="p-4 font-bold text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {registrations.map((reg, index) => (
                              <tr key={reg.id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4 text-white/70 whitespace-nowrap">
                                  {new Date(reg.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="p-4 text-white capitalize font-medium">{reg.tournament_type || '-'}</td>
                                <td className="p-4">
                                  <div className="inline-flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-pubg-yellow font-mono text-xs">
                                    <Calendar className="w-3 h-3" />
                                    {reg.time_slot || '-'}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className={cn(
                                    "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                                    reg.payment_status === 'verified' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                    reg.payment_status === 'pending' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                    "bg-red-500/10 text-red-400 border border-red-500/20"
                                  )}>
                                    {reg.payment_status || 'unknown'}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDownloadPDF(reg)}
                                    disabled={downloadingId === reg.cashfree_order_id}
                                    className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-[10px] font-bold uppercase tracking-wider border border-blue-500/20 w-[100px]"
                                  >
                                    {downloadingId === reg.cashfree_order_id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <>
                                        <Download className="w-3.5 h-3.5" /> Receipt
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </motion.div>
              </div>
            ) : activeTab === 'upcoming' ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="overflow-hidden border-white/10 bg-[#111]/80 backdrop-blur-md">
                  {upcomingTournament?.bg_image_url && (
                    <div className="h-48 relative border-b border-white/10">
                      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${upcomingTournament.bg_image_url})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                      <div className="absolute bottom-6 left-8">
                        <h2 className="text-3xl font-black font-heading uppercase text-white shadow-black drop-shadow-md">{upcomingTournament.headline || 'Upcoming Tournament'}</h2>
                        <p className="text-pubg-yellow font-medium mt-1 drop-shadow-md">{upcomingTournament.match_name}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    {!upcomingTournament ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-pubg-yellow animate-spin mx-auto" />
                        <p className="text-white/50 mt-4">Loading upcoming tournaments...</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex flex-wrap gap-4 mb-8">
                          <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Date</p>
                            <p className="text-white font-medium">{new Date(upcomingTournament.tournament_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Mode</p>
                            <p className="text-white font-medium">{upcomingTournament.match_mode}</p>
                          </div>
                          <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Map</p>
                            <p className="text-white font-medium">{upcomingTournament.map_area}</p>
                          </div>
                          <div className="bg-white/5 px-4 py-2 rounded-lg border border-pubg-yellow/30 bg-pubg-yellow/5">
                            <p className="text-[10px] text-pubg-yellow/80 uppercase font-bold tracking-widest">Prize</p>
                            <p className="text-pubg-yellow font-bold">{upcomingTournament.prize}</p>
                          </div>
                        </div>

                        <form ref={formRef} onSubmit={handleDashboardRegistration} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Full Name *</label>
                              <input name="fullName" required type="text" defaultValue={displayData.full_name} className="w-full bg-black border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-pubg-yellow" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Team Name *</label>
                              <input name="teamName" required type="text" defaultValue={displayData.team_name !== '-' ? displayData.team_name : ''} className="w-full bg-black border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-pubg-yellow" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-white/70 text-sm font-bold uppercase tracking-widest">BGMI ID *</label>
                              <input name="bgmiId" required type="text" defaultValue={displayData.bgmi_id !== '-' ? displayData.bgmi_id : ''} className="w-full bg-black border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-pubg-yellow" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Mobile Number *</label>
                              <input name="mobileNumber" required type="tel" defaultValue={displayData.mobile_number !== '-' ? displayData.mobile_number : ''} className="w-full bg-black border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-pubg-yellow" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-white/70 text-sm font-bold uppercase tracking-widest">UPI ID *</label>
                              <input name="upiId" required type="text" defaultValue={displayData.upi_id || ''} className="w-full bg-black border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-pubg-yellow" />
                            </div>
                          </div>

                          <div className="space-y-2 mt-6">
                            <label className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3 block">Available Time Slots *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {timeSlots.map((slot) => {
                                const count = slotCounts[slot.value] || 0;
                                const isFull = count >= slot.capacity;
                                return (
                                  <label
                                    key={slot.value}
                                    className={`relative flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${isFull
                                        ? 'border-red-500/30 bg-red-500/5 cursor-not-allowed opacity-60'
                                        : 'border-white/10 bg-black hover:border-pubg-yellow/50 hover:bg-pubg-yellow/5 has-[:checked]:border-pubg-yellow has-[:checked]:bg-pubg-yellow/10'
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name="timeSlot"
                                      value={slot.value}
                                      required
                                      disabled={isFull}
                                      className="w-4 h-4 accent-pubg-yellow"
                                    />
                                    <div className="flex-1">
                                      <span className={`text-sm font-medium ${isFull ? 'text-white/40 line-through' : 'text-white'}`}>
                                        {slot.label}
                                      </span>
                                      <div className={`text-xs mt-0.5 ${isFull ? 'text-red-400' : 'text-white/40'}`}>
                                        {isFull ? 'FULL' : `${count}/${slot.capacity} registered`}
                                      </div>
                                    </div>
                                    {isFull && (
                                      <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                        Completed
                                      </span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex justify-start w-full pt-6">
                            <Button type="submit" size="lg" glow disabled={registering} className="w-full md:w-auto">
                              <span className="flex items-center gap-2">
                                {registering ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                <span>{registering ? "Processing Payment..." : `Quick Register (₹${fee})`}</span>
                              </span>
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-8 border-pubg-yellow/20 bg-[#111]/80 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-black font-heading uppercase text-white flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-pubg-yellow" /> Match Announcements
                    </h2>
                  </div>

                  {matchChats.length === 0 ? (
                    <div className="text-center py-8">
                      <ShieldAlert className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/50">No announcements or room details posted for your matches yet.</p>
                      <p className="text-white/30 text-sm mt-1">Admin will post the ID/Password here before the match starts.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {matchChats.map((chat, idx) => (
                        <div key={chat.id || idx} className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-pubg-yellow"></div>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-pubg-yellow font-bold uppercase tracking-widest text-xs flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Admin
                              </span>
                              {chat.time_slot && (
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70 font-mono">
                                  {chat.time_slot}
                                </span>
                              )}
                            </div>
                            <span className="text-white/40 text-[10px]">{new Date(chat.created_at).toLocaleString()}</span>
                          </div>
                          
                          {chat.message && (
                            <p className="text-white/90 text-sm mb-4 whitespace-pre-wrap">{chat.message}</p>
                          )}

                          {(chat.room_id || chat.room_password) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                              <div className="bg-black/50 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                                <div>
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Room ID</p>
                                  <p className="text-white font-mono">{chat.room_id || '-'}</p>
                                </div>
                                {chat.room_id && (
                                  <button 
                                    onClick={() => copyToClipboard(chat.room_id)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                    title="Copy Room ID"
                                  >
                                    {copiedText === chat.room_id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                )}
                              </div>
                              
                              <div className="bg-black/50 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                                <div>
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Password</p>
                                  <p className="text-white font-mono">{chat.room_password || '-'}</p>
                                </div>
                                {chat.room_password && (
                                  <button 
                                    onClick={() => copyToClipboard(chat.room_password)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                    title="Copy Password"
                                  >
                                    {copiedText === chat.room_password ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
  );
}
