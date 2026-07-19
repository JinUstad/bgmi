"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Trophy, Calendar, CheckCircle2, IndianRupee, Loader2, Gamepad2, AlertCircle, Download, MessageSquare, Copy, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UserDashboardContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [matchChats, setMatchChats] = useState<any[]>([]);
  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchRegistration = async () => {
      // First try to get by orderId if it exists, otherwise by current logged in user
      let regData = null;

      if (orderId) {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('cashfree_order_id', orderId)
          .single();
        if (!error) regData = data;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          if (!error) regData = data;
        }
      }

      if (regData) {
        setData(regData);
        // Fetch match and match_chats
        const { data: matchData } = await supabase
          .from('matches')
          .select('id, room_id, room_password')
          .eq('time_slot', regData.time_slot)
          .single();
        
        if (matchData) {
          const { data: chats } = await supabase
            .from('match_chats')
            .select('*')
            .eq('match_id', matchData.id)
            .order('created_at', { ascending: true });
          
          setMatchChats(chats || []);
        }
      }
      setLoading(false);
    };

    fetchRegistration();
  }, [orderId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!data) return;
    setDownloading(true);

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
      doc.text(`Receipt ID: ${data.cashfree_order_id}`, 14, 44);
      doc.text(`Date: ${new Date(data.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - 14, 44, { align: 'right' });

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
          ['Full Name', data.full_name || '-'],
          ['Team Name', data.team_name || '-'],
          ['BGMI ID', data.bgmi_id || '-'],
          ['Mobile Number', data.mobile_number || '-'],
          ['Email', data.email || '-'],
          ['Tournament Type', (data.tournament_type || '-').toUpperCase()],
          ['Time Slot', data.time_slot || '-'],
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
          ['Order ID', data.cashfree_order_id || '-'],
          ['Amount Paid', `Rs. ${data.payment_amount || 0}`],
          ['Payment Status', (data.payment_status || 'pending').toUpperCase()],
          ['Registration Date', data.created_at ? new Date(data.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'],
        ],
      });

      // Status Badge
      const paymentTableEnd = (doc as any).lastAutoTable.finalY + 15;
      const statusText = data.payment_status === 'verified' ? 'REGISTRATION CONFIRMED' : 'PAYMENT PENDING';
      const statusColor: [number, number, number] = data.payment_status === 'verified' ? [34, 197, 94] : [234, 179, 8];
      
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
      doc.save(`BGMI_Registration_${data.cashfree_order_id}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pubg-yellow animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-black font-heading uppercase text-white mb-4">Record Not Found</h1>
        <p className="text-white/60 text-center mb-8">We couldn&apos;t find a registration associated with this order ID.</p>
        <Link href="/registration">
          <Button glow>Register Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative pb-20">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pubg-yellow/10 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-pubg-yellow/10 border border-pubg-yellow/30 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-pubg-yellow" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black font-heading uppercase text-white tracking-tighter">
                  Welcome, <span className="text-pubg-yellow">{data.full_name}</span>
                </h1>
                <p className="text-white/60 text-lg mt-1">Player Dashboard & Registration Details</p>
              </div>
            </div>
            <Button 
              onClick={handleDownloadPDF} 
              disabled={downloading}
              glow
              className="shrink-0"
            >
              <span className="flex items-center gap-2">
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{downloading ? 'Generating...' : 'Download Receipt'}</span>
              </span>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Status</p>
                    <p className="text-white font-bold text-xl uppercase">
                      {data.payment_status === 'verified' ? 'Registered' : 'Pending'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Gamepad2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Matches Played</p>
                    <p className="text-white font-bold text-3xl">0</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-yellow-500/10">
                    <IndianRupee className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Amount Paid</p>
                    <p className="text-white font-bold text-3xl">₹{data.payment_amount || 0}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black font-heading uppercase text-white">
                  Registration Details
                </h2>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="text-pubg-yellow hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Team Name</p>
                    <p className="text-white text-lg font-medium">{data.team_name}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">BGMI ID</p>
                    <p className="text-pubg-yellow text-lg font-bold font-mono">{data.bgmi_id}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Contact</p>
                    <p className="text-white text-lg">{data.mobile_number}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Tournament Type</p>
                    <p className="text-white text-lg capitalize">{data.tournament_type}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Preferred Time Slot</p>
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg mt-1">
                      <Calendar className="w-4 h-4 text-pubg-yellow" />
                      <span className="text-white text-sm font-medium">{data.time_slot}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-white/70 text-sm font-mono bg-white/5 p-2 rounded">{data.cashfree_order_id}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card className="p-8 border-pubg-yellow/20">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black font-heading uppercase text-white flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-pubg-yellow" /> Match Announcements & Room Details
                </h2>
              </div>

              {matchChats.length === 0 ? (
                <div className="text-center py-8">
                  <ShieldAlert className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">No announcements or room details posted for this match yet.</p>
                  <p className="text-white/30 text-sm mt-1">Admin will post the ID/Password here before the match starts.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {matchChats.map((chat) => (
                    <div key={chat.id} className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-pubg-yellow"></div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-pubg-yellow font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" /> Admin
                        </span>
                        <span className="text-white/40 text-xs">{new Date(chat.created_at).toLocaleString()}</span>
                      </div>
                      
                      {chat.message && (
                        <p className="text-white/90 text-sm mb-4 whitespace-pre-wrap">{chat.message}</p>
                      )}

                      {(chat.room_id || chat.room_password) && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
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

        </div>
      </div>
    </div>
  );
}


