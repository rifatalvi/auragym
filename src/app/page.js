import BannerSection from '@/componet/home/BannerSection';
import FeaturedClasses from '@/componet/home/FeaturedClasses';
import ForumPosts from '@/componet/home/ForumPosts';
import HowItWorks from '@/componet/home/HowItWorks';
import Testimonials from '@/componet/home/Testimonials';

export const metadata = {
  title: 'AuraGym — Elite Fitness Experience',
  description:
    'World-class trainers, 80+ weekly classes, and a vibrant community. Start your transformation at AuraGym today.',
};

export default function Home() {
  return (
    <>
      <BannerSection />
      <FeaturedClasses />
      <HowItWorks />
      <ForumPosts />
      <Testimonials />
    </>
  );
}
