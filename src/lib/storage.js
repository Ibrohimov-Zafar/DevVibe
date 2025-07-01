// LocalStorage utility functions

export const storage = {
  // Ma'lumot saqlash
  set: (key, data) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('LocalStorage ga saqlashda xatolik:', error);
        return false;
      }
    }
    return false;
  },

  // Ma'lumot olish
  get: (key, defaultValue = null) => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('LocalStorage dan olishda xatolik:', error);
        return defaultValue;
      }
    }
    return defaultValue;
  },

  // Ma'lumot o'chirish
  remove: (key) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('LocalStorage dan o\'chirishda xatolik:', error);
        return false;
      }
    }
    return false;
  },

  // Barcha ma'lumotlarni o'chirish
  clear: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('LocalStorage ni tozalashda xatolik:', error);
        return false;
      }
    }
    return false;
  },

  // LocalStorage mavjudligini tekshirish
  isAvailable: () => {
    if (typeof window !== 'undefined') {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }
};

// Data keys
export const STORAGE_KEYS = {
  PORTFOLIO: 'portfolioData',
  POSTS: 'postsData',
  PROJECTS: 'projectsData',
  SKILLS: 'skillsData',
  PROFILE: 'profileData',
  SETTINGS: 'settingsData',
  LANGUAGE: 'language'
};
