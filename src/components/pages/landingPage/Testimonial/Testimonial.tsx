"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { testimonialsData } from "@/utils/dummyData";

interface CourseStats {
  totalTutorials: number;
  totalHours: number;
  satisfactionRate: number;
}

const Testimonial = () => {
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [displayStats, setDisplayStats] = useState({
    totalTutorials: 0,
    totalHours: 0,
    satisfactionRate: 0,
  });

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch stats with axios
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-course-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching course stats:", error);
      }
    };

    fetchStats();
  }, []);

  // ✅ Smooth count-up function
  const countUp = (target: number, key: keyof typeof displayStats, duration = 1500) => {
    let start = 0;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplayStats((prev) => ({
        ...prev,
        [key]: Math.round(progress * target),
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // ✅ Intersection observer triggers smooth count-up every time section comes into view
  useEffect(() => {
    if (!sectionRef.current || !stats) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(stats.totalTutorials, "totalTutorials");
            countUp(stats.totalHours, "totalHours");
            countUp(stats.satisfactionRate, "satisfactionRate");
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [stats]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-[#F4FAFD]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 font-playfairDisplay">
            Words from Our Community
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="text-center space-y-[20px]">
              <p className="text-[#404040] leading-[120%] text-lg">{testimonial.text}</p>

              <div>
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg font-bold">
                      ★
                    </span>
                  ))}
                </div>

                <div>
                  <h4 className="text-gray-600 text-lg">{testimonial.name}</h4>
                  <p className="text-black font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        {stats && (
          <div className="border-t border-gray-200 pt-16">
            <div className="grid md:grid-cols-3 gap-8 text-center relative">
              <div className="relative">
                <div className="text-5xl lg:text-7xl font-medium text-gray-900">
                  {displayStats.totalTutorials}+
                </div>
                <p className="text-gray-600 text-xl">Tutorials</p>
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gray-300"></div>
              </div>

              <div className="relative">
                <div className="text-5xl lg:text-7xl font-medium text-gray-900">
                  {displayStats.totalHours}+
                </div>
                <p className="text-gray-600 text-xl">Hours</p>
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gray-300"></div>
              </div>

              <div className="relative">
                <div className="text-5xl lg:text-7xl font-medium text-gray-900">
                  {displayStats.satisfactionRate}%
                </div>
                <p className="text-gray-600 text-xl">Satisfaction</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonial;
