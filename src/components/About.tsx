import React from 'react';
import { Target, Users, TrendingUp, Linkedin } from 'lucide-react';

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
      title: 'About NafaVerse',
      subtitle: "Empowering Pakistan's Financial Future",
      missionTitle: 'Our Mission',
      mission: [
        'Empowering you to achieve financial independence, faster.',
        'We believe everyone deserves access to smart investment strategies and financial education.',
        'Through gamification, simulation, and personalized guidance, we make investing engaging and profitable.'
      ],
      valuesTitle: 'Our Values',
      values: [
        { icon: Target, title: 'Inclusive', description: 'Financial literacy for everyone, regardless of background' },
        { icon: Users, title: 'Community', description: 'Building a supportive network of smart investors' },
        { icon: TrendingUp, title: 'Results', description: 'Measurable outcomes that transform financial futures' }
      ],
      teamTitle: 'Meet Our Team',
      teamSubtitle: 'The passionate individuals behind NafaVerse'
    },
    ur: {
      title: 'NafaVerse ke bare mein',
      subtitle: 'Pakistan ke financial mustaqbil ko empower karna',
      missionTitle: 'Hamara Mission',
      mission: [
        'Aap ko financial azaadi jaldi hasil karne mein madad dena.',
        'Hum samajhte hain ke har shakhs ko smart investment strategies aur financial taleem tak rasai honi chahiye.',
        'Gamification, simulation aur personalized rehnumai ke zariye hum investing ko engaging aur munafa bakhsh banate hain.'
      ],
      valuesTitle: 'Hamari Qeematain (Values)',
      values: [
        { icon: Target, title: 'Inclusive', description: 'Har kisi ke liye financial literacy, background se baghair' },
        { icon: Users, title: 'Community', description: 'Smart investors ka supportive network' },
        { icon: TrendingUp, title: 'Results', description: 'Aise natayij jo mustaqbil badal dein' }
      ],
      teamTitle: 'Team se milain',
      teamSubtitle: 'NafaVerse ke peeche jo jazbati log hain'
    }
  } as const;

  const t = content[currentLanguage];

  return (
    <div className="pt-24 px-2 sm:px-0 overflow-x-hidden bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] relative">
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

        {/* Mission Section */}
        <div className="mb-16">
          <div className="nv-card rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              {t.missionTitle}
            </h2>
            <div className="space-y-4">
              {t.mission.map((statement, index) => (
                <p key={index} className="text-lg text-purple-100 text-center leading-relaxed">
                  {statement}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {t.valuesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.values.map((value, index) => (
              <div key={index} className="nv-card rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-[#A786DF] to-[#60A5FA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-purple-100/90">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            {t.teamTitle}
          </h2>
          <p className="text-lg text-purple-100 text-center mb-12">
            {t.teamSubtitle}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="nv-card rounded-2xl p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-[#A786DF] to-[#60A5FA] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {member.name}
                </h3>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 bg-[#00B8A9] text-white rounded-full hover:bg-[#00B8A9]/90 transition-colors duration-200"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};