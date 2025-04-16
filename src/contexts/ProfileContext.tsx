
import { createContext, useState, useContext, ReactNode } from 'react';

interface ProfileData {
  gender: string;
  height: string;
  weight: string;
  waist: string;
  inseam: string;
  chest: string;
  shoulders: string;
  preferredFit: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: ProfileData) => void;
}

const defaultProfileData: ProfileData = {
  gender: '',
  height: '',
  weight: '',
  waist: '',
  inseam: '',
  chest: '',
  shoulders: '',
  preferredFit: 'regular'
};

const ProfileContext = createContext<ProfileContextType>({
  profileData: defaultProfileData,
  updateProfile: () => {}
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    // Try to load from localStorage
    const savedProfile = localStorage.getItem('fitbud_profile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfileData;
  });

  const updateProfile = (data: ProfileData) => {
    setProfileData(data);
    localStorage.setItem('fitbud_profile', JSON.stringify(data));
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
