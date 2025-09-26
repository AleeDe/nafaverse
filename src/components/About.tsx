import React from 'react';
import { Linkedin } from 'lucide-react';

interface AboutProps {
  currentLanguage: 'en' | 'ur';
  teamMembers: Array<{
    name: string;
    linkedin: string;
    image: string;
  }>;
}

export const About: React.FC<AboutProps> = ({ currentLanguage, teamMembers }) => {
  const content = {
    en: {
      title: 'About Us',
      subtitle: 'NafaVerse - Pakistan\'s First AI-Powered Financial Literacy Platform',
      missionTitle: 'Our Mission',
      missionText: 'We aim to enhance financial literacy in Pakistan by combining Islamic financial principles with cutting-edge AI technology to help people make better financial decisions.',
      visionTitle: 'Our Vision',
      visionText: 'To provide every Pakistani with the opportunity to achieve financial independence.',
      valuesTitle: 'Our Values',
      values: [
        'Islamic Finance Principles',
        'Community-Based Approach',
        'AI-Powered Learning',
        'Transparency and Trust'
      ],
      teamTitle: 'Meet Our Team'
    },
    ur: {
      title: 'Humare Bare Mein',
      subtitle: 'NafaVerse - Pakistan ka Pehla AI-Powered Financial Literacy Platform',
      missionTitle: 'Hamara Mission',
      missionText: 'Hum Pakistan mein financial literacy ko behtar banane ka maqsad rakhte hain Islamic financial principles aur cutting-edge AI technology ko milaker.',
      visionTitle: 'Hamara Vision',
      visionText: 'Har Pakistani ko financial independence hasil karne ka mauka dena.',
      valuesTitle: 'Hamari Values',
      values: [
        'Islamic Finance Principles',
        'Community-Based Approach',
        'AI-Powered Learning',
        'Transparency and Trust'
      ],
      teamTitle: 'Hamari Team se Miliye'
    }
  } as const;

  const t = content[currentLanguage];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-[#A786DF] font-normal max-w-4xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-medium text-[#F59E0B] mb-6">
              {t.missionTitle}
            </h2>
            <p className="text-white/90 leading-relaxed text-base">
              {t.missionText}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-medium text-[#F59E0B] mb-6">
              {t.visionTitle}
            </h2>
            <p className="text-white/90 leading-relaxed text-base">
              {t.visionText}
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-medium text-[#F59E0B] mb-8 text-center">
              {t.valuesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.values.map((value, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#A786DF] rounded-full"></div>
                  <span className="text-white/90 text-base">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-medium text-[#F59E0B] mb-8 text-center">
            {t.teamTitle}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => {
              const initials = member.name.split(' ').map(n => n[0]).join('');
              const gradients = [
                'from-purple-400 to-pink-400',
                'from-blue-400 to-purple-400', 
                'from-pink-400 to-red-400',
                'from-green-400 to-blue-400',
                'from-yellow-400 to-orange-400'
              ];
              
              return (
                <div key={index} className="text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center mb-4 mx-auto`}>
                    <span className="text-2xl font-medium text-white">
                      {initials}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-2">
                    {member.name}
                  </h3>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#A786DF] hover:text-white transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};