"use client";

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Briefcase, Star, Phone, Folder } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext'; // useEffect va useState o'rniga buni import qilamiz

const HeroSection = () => {
  const { profile, loading } = useProfile(); // Ma'lumotni context'dan olamiz

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Yuklanmoqda...</div>;
  }

  if (!profile) {
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Profil topilmadi.</div>;
  }

  const stats = [
    { icon: <MapPin size={20} className="text-blue-400" />, label: profile.location || 'Toshkent' },
    { icon: <Clock size={20} className="text-blue-400" />, label: `${profile.experience || '2+'} yillik tajriba` },
    { icon: <Briefcase size={20} className="text-blue-400" />, label: '15+ Loyihalar' },
    { icon: <Star size={20} className="text-yellow-400" />, label: '100% Sifat' },
  ];

  return (
    <section className="bg-slate-900 text-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1.5">
              <div className="bg-slate-900 rounded-full w-full h-full p-2">
                <Image
                  src={profile.avatar || '/zafar.jpg'} // public/zafar.jpg rasmini ishlatadi
                  alt={profile.name}
                  width={256}
                  height={256}
                  className="rounded-full object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{profile.name}</h1>
            <p className="text-xl md:text-2xl text-blue-400 font-medium mb-6">{profile.profession}</p>
            <p className="text-slate-300 max-w-xl mx-auto md:mx-0 mb-8">{profile.bio}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center md:items-start">
                  {stat.icon}
                  <span className="mt-2 text-sm text-slate-300">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/pages/contact" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105">
                <Phone size={18} />
                Bog'lanish
              </Link>
              <Link href="/pages/portfolio" className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-full font-semibold transition duration-300">
                <Folder size={18} />
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
             