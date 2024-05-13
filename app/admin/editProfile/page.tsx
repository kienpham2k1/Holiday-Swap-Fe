import EditProfileComponent from '@/app/components/dashboard/EditProfileComponent';
import requireAuth from '@/app/libs/requireAuth';
import React from 'react';

export const metadata = {
  title: 'Edit Profile Admin',
};

export default function EditProfileStaffPage() {
  return requireAuth(<EditProfileComponent />, [1]);
}
