"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const ProfileContext = createContext({
  profile: null,
  loading: true,
});

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Profil ma'lumotlarini yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
