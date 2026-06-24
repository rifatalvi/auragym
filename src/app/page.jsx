import BannerSection from "@/componet/home/BannerSection";
import FeaturedClasses from "@/componet/home/FeaturedClasses";
import HowItWorks from "@/componet/home/HowItWorks";
import Testimonials from "@/componet/home/Testimonials";
import ForumPosts from "@/componet/home/ForumPosts";

export const metadata = {
  title: "AuraGym — Elite Fitness Experience",
  description: "World-class trainers, 80+ weekly classes, and a vibrant community. Start your transformation at AuraGym today.",
};

export default function HomePage() {
  return (
    <main>
      <BannerSection />
      <FeaturedClasses />
      <HowItWorks />
      <Testimonials />
      <ForumPosts />
    </main>
  );
}
