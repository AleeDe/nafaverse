import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactProps {
  currentLanguage: 'en' | 'ur';
}

export const Contact: React.FC<ContactProps> = ({ currentLanguage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const content = {
    en: {
      title: "Get in Touch",
      subtitle: "Have questions? We'd love to hear from you.",
      email: "support@nafaverse.com",
      phone: "+92 300 1234567",
      address: "Karachi, Pakistan",
      form: {
        name: "Your Name",
        email: "Your Email",
        message: "Your Message",
        send: "Send Message"
      },
      contactInfo: "Contact Information"
    },
    ur: {
      title: "Raabta mein rahain",
      subtitle: "Koi sawal? Hum sun’na pasand karte hain.",
      email: "support@nafaverse.com",
      phone: "+92 300 1234567",
      address: "Karachi, Pakistan",
      form: {
        name: "Aap ka Naam",
        email: "Aap ka Email",
        message: "Aap ka Paighaam",
        send: "Paighaam bhejain"
      },
      contactInfo: "Raabta ki Maloomat"
    }
  } as const;

  const t = content[currentLanguage];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  {t.form.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#A786DF] focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full nv-glow-btn py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                {t.form.send}
              </button>
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