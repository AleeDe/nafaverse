import { About } from '../components/About';
import { Footer } from '../components/Footer';
import { ArrowUp } from 'lucide-react';
import { useDashboard } from '../components/DashboardContext';

const teamMembers = [
	{
		name: 'Aaisha Iqbal',
		linkedin: 'https://www.linkedin.com/in/aaisha-iqbal/',
		image: '/api/placeholder/100/100'
	},
	{
		name: 'Javeria Amir',
		linkedin: 'https://www.linkedin.com/in/javeria-amir-7730642b8/',
		image: '/api/placeholder/100/100'
	},
	{
		name: 'Muhammad Ali',
		linkedin: 'https://www.linkedin.com/in/muhammad-ali-296943208/',
		image: '/api/placeholder/100/100'
	},
	{
		name: 'Rabeea Hussain',
		linkedin: 'https://www.linkedin.com/in/rabeea-hussain-15a823375/',
		image: '/api/placeholder/100/100'
	},
	{
		name: 'Haleema Fatima',
		linkedin: 'https://www.linkedin.com/in/haleema-fatima-271336326/',
		image: '/api/placeholder/100/100'
	}
];

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function AboutPage() {
	const { currentLanguage } = useDashboard();

	const content = {
		en: {
			title: 'About NafaVerse',
			description:
				'We are on a mission to empower Pakistanis with financial literacy, guided by Islamic principles.'
		},
		ur: {
			title: 'NafaVerse کے بارے میں',
			description:
				'ہمارا مشن پاکستانیوں کو اسلامی اصولوں کے مطابق مالی خواندگی سے بااختیار بنانا ہے۔'
		}
	};

	const t = content[currentLanguage];

	return (
		<>
			<About currentLanguage={currentLanguage} teamMembers={teamMembers} />
			<Footer />

			<button
				onClick={scrollToTop}
				className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
			>
				<ArrowUp className="w-5 h-5" />
			</button>

			<div className="container mx-auto px-4 py-16 text-center">
				<h1 className="text-4xl font-bold mb-4">{t.title}</h1>
				<p className="text-lg">{t.description}</p>
			</div>
		</>
	);
}
