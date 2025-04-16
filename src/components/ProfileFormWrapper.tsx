
import { useState } from 'react';
import ProfileForm from './ProfileForm';
import { useProfile } from '@/contexts/ProfileContext';

interface ProfileFormWrapperProps {
  onComplete: () => void;
}

const ProfileFormWrapper = ({ onComplete }: ProfileFormWrapperProps) => {
  const { updateProfile } = useProfile();
  
  const handleProfileSubmit = (profileData: any) => {
    updateProfile(profileData);
    onComplete();
  };
  
  return <ProfileForm onComplete={handleProfileSubmit} />;
};

export default ProfileFormWrapper;
