"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin, Github, Twitter, MapPin, Briefcase, Star, Clock, Send, Instagram } from 'lucide-react';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ projects: 0, experience: 2 });
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, portfolioRes, skillsRes, experiencesRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/portfolio'),
          fetch('/api/skills'),
          fetch('/api/experience'),
        ]);

        const profileData = await profileRes.json();
        const portfolioData = await portfolioRes.json();
        const skillsData = await skillsRes.json();
        const experiencesData = await experiencesRes.json();

        if (profileData.success) {
          setProfile(profileData.data);
        }
        if (portfolioData.success) {
          setStats((prev) => ({ ...prev, projects: portfolioData.data.length }));
        }
        if (skillsData.success) {
          setSkills(skillsData.data);
        }
        if (experiencesData.success) {
          setExperiences(experiencesData.data);
        }
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <Navigation />
        <div className="text-center py-40">Profil ma'lumotlari topilmadi.</div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <Image
                  src={profile.avatar || '/zafar.jpg'}
                  alt={profile.name}
                  width={200}
                  height={200}
                  className="rounded-full border-8 border-white dark:border-slate-700 shadow-lg object-cover w-48 h-48"
                />
              </div>
              <div className="md:col-span-2 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100">{profile.name}</h1>
                <p className="text-xl font-medium text-blue-600 dark:text-blue-400 mt-1">{profile.profession}</p>
                <p className="text-gray-600 dark:text-slate-300 mt-4 leading-relaxed">{profile.bio}</p>
                <div className="flex justify-center md:justify-start gap-4 mt-6">
                  <Link
                    href="/pages/contact"
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Mail size={18} /> Bog'lanish
                  </Link>
                  <Link
                    href="/pages/portfolio"
                    className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-200 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Briefcase size={18} /> Portfolio
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <MapPin className="text-red-500 mb-2" size={24} />
                <p className="font-semibold text-gray-800 dark:text-slate-200">{profile.location}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Joylashuv</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="text-green-500 mb-2" size={24} />
                <p className="font-semibold text-gray-800 dark:text-slate-200">{profile.experience || '2'}+ Yil</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Tajriba</p>
              </div>
              <div className="flex flex-col items-center">
                <Briefcase className="text-purple-500 mb-2" size={24} />
                <p className="font-semibold text-gray-800 dark:text-slate-200">{stats.projects}+ Loyiha</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Tugatilgan</p>
              </div>
              <div className="flex flex-col items-center">
                <Star className="text-yellow-500 mb-2" size={24} />
                <p className="font-semibold text-gray-800 dark:text-slate-200">100% Sifat</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Kafolat</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4">Ijtimoiy tarmoqlar</h3>
              <div className="flex justify-center gap-4">
                {profile.social_github && (
                  <a
                    href={profile.social_github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                  >
                    <Github className="text-gray-800 dark:text-slate-200" />
                  </a>
                )}
                {profile.social_linkedin && (
                  <a
                    href={profile.social_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                  >
                    <Linkedin className="text-blue-700" />
                  </a>
                )}
                {profile.social_twitter && (
                  <a
                    href={profile.social_twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                  >
                    <Twitter className="text-blue-500" />
                  </a>
                )}
                {profile.social_telegram && (
                  <a
                    href={profile.social_telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                  >
                    <Send className="text-sky-500" />
                  </a>
                )}
                {profile.social_instagram && (
                  <a
                    href={profile.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                  >
                    <Instagram className="text-pink-600" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mt-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100 mb-8">
              💪 Mening Ko'nikmalarim
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl text-center hover:shadow-md transition duration-300"
                >
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <h3 className="font-semibold text-gray-800 dark:text-slate-200">{skill.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          {experiences.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mt-12">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100 mb-12">
                📈 Mening Yo'lim
              </h2>
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-gray-200 dark:bg-slate-700"></div>
                <div className="space-y-12">
                  {experiences.map((item, index) => (
                    <div key={item.id} className="relative flex items-start gap-4 md:gap-8">
                      <div className="absolute left-4 md:left-1/2 top-1 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-white font-bold">
                        {item.icon}
                      </div>
                      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16 md:order-2'}`}>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">{item.year}</p>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm">{item.description}</p>
                      </div>
                      <div className="hidden md:block w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mt-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100 mb-8">
              🎓 Ta'lim
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  degree: 'Bachelor of Science in Computer Science',
                  institution: "O'zbekiston Milliy Universiteti",
                  year: '2017 - 2021',
                  description: "Kompyuter fanlari bo'yicha bakalavr darajasi. Dasturlash, ma'lumotlar bazasi va tizim tahlili bo'yicha chuqur bilimlar.",
                  icon: '🎓',
                },
                {
                  degree: 'Master of Science in Software Engineering',
                  institution: 'Inha Universiteti',
                  year: '2021 - 2023',
                  description: "Axborot texnologiyalari va dasturiy ta'minot muhandisligi bo'yicha magistr darajasi. Loyihalarni boshqarish va dasturiy ta'minotni ishlab chiqish bo'yicha mutaxassislik.",
                  icon: '📚',
                },
              ].map((edu, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl shadow-md"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl text-blue-600">{edu.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-200">{edu.degree}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{edu.institution}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">{edu.description}</p>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 dark:text-slate-400">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mt-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100 mb-8">
              ⭐ Mening Qadriyatlarim
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Sifat',
                  description: 'Har bir loyihada yuqori sifat va professional yondashuv',
                  icon: '🏆',
                },
                {
                  title: 'Innovatsiya',
                  description: 'Zamonaviy texnologiyalar va kreativ yechimlar',
                  icon: '💡',
                },
                {
                  title: 'Ishonch',
                  description: 'Vaqtida topshirish va mijozlar bilan ochiq muloqot',
                  icon: '🤝',
                },
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-slate-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">🎯 Qiziqarli Faktlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '50+', label: 'Coding Soatlari/Hafta', icon: '⏰' },
                { number: '15+', label: 'Tugallangan Loyihalar', icon: '✅' },
                { number: '3+', label: 'Dasturlash Tillari', icon: '💻' },
                { number: '100%', label: 'Mijoz Mamnuniyati', icon: '😊' },
              ].map((fact, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-2">{fact.icon}</div>
                  <div className="text-2xl font-bold mb-1">{fact.number}</div>
                  <div className="text-sm opacity-90">{fact.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-4">
              🚀 Keling, Birgalikda Yarataylik!
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 mb-8">
              Sizning g'oyangizni professional loyihaga aylantirish uchun tayyor
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pages/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition duration-300 transform hover:scale-105"
              >
                💬 Bog'lanish
              </Link>
              <Link
                href="/pages/services"
                className="bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full font-semibold transition duration-300 transform hover:scale-105"
              >
                ⚡ Xizmatlar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}