import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { apiService } from '../api/apiService'; // added api import

interface ContactProps {
  currentLanguage: 'en' | 'ur';
}

export function Contact(props: { currentLanguage: 'en' | 'ur' }) {
  // --------- added submission state & handler (no design changes) ----------
  const [cfName, setCfName] = useState('');
  const [cfEmail, setCfEmail] = useState('');
  const [cfMessage, setCfMessage] = useState('');
  const [cfSubmitting, setCfSubmitting] = useState(false);
  const [cfStatus, setCfStatus] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCfSubmitting(true);
    setCfStatus(null);
    try {
      await apiService.submitContactFeedback({ name: cfName, email: cfEmail, message: cfMessage });
      setCfName('');
      setCfEmail('');
      setCfMessage('');
      setCfStatus('success');
    } catch (err) {
      console.error(err);
      setCfStatus('error');
    } finally {
      setCfSubmitting(false);
    }
  };
  // -------------------------------------------------------------------------

  const content = {
    en: {
      title: "Give Us Feedback",
      subtitle: "Have feedback? We'd love to hear from you.",
      email: "support@nafaverse.com",
      phone: "+92 300 1234567",
      address: "Karachi, Pakistan",
      form: {
        name: "Your Name",
        email: "Your Email",
        message: "Your Message",
        send: "Send Feedback"
      },
      contactInfo: "Contact Information"
    },
    ur: {
      title: "ہمیں فیڈبیک دیں",
      subtitle: "فیڈبیک ہے؟ ہم سننے کے لیے بے تاب ہیں۔",
      email: "support@nafaverse.com",
      phone: "+92 300 1234567",
      address: "Karachi, Pakistan",
      form: {
        name: "آپ کا نام",
        email: "آپ کا ای میل",
        message: "آپ کا پیغام",
        send: "فیڈبیک بھیجیں"
      },
      contactInfo: "رابطہ کی معلومات"
    }
  } as const;

  const t = content[props.currentLanguage];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] relative overflow-hidden px-2 sm:px-0 overflow-x-hidden">
      <div className="absolute inset-0 opacity-15">
              <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-[#A786DF] font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="nv-card rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  {t.form.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={cfName}
                  onChange={(e) => setCfName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#A786DF] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  {t.form.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={cfEmail}
                  onChange={(e) => setCfEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#A786DF] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  {t.form.message}
                </label>
                <textarea
                  name="message"
                  value={cfMessage}
                  onChange={(e) => setCfMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#A786DF] focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={cfSubmitting}
                className="w-full nv-glow-btn py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                {cfSubmitting ? 'Sending...' : <><Send className="w-5 h-5 mr-2" />{t.form.send}</>}
              </button>

              {cfStatus === 'success' && <div className="text-sm text-green-400 mt-2">Sent — thank you.</div>}
              {cfStatus === 'error' && <div className="text-sm text-red-400 mt-2">Submission failed. Try again.</div>}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="nv-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t.contactInfo}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#A786DF] to-[#60A5FA] rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-purple-100">{t.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#A786DF] to-[#60A5FA] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-purple-100">{t.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#A786DF] to-[#60A5FA] rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Address</p>
                    <p className="text-purple-100">{t.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};