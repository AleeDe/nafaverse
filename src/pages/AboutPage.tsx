import { useState, useEffect } from 'react';
import { About } from '../components/About';
import { Footer } from '../components/Footer';
import { SkeletonLoader } from '../components/SkeletonLoader';
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
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return <SkeletonLoader type="page" />;
	}

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
		</>
	);
}
