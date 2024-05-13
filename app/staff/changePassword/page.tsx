import GetCurrentUser from '@/app/actions/getCurrentUser';
import ChangePassword from '@/app/components/dashboard/ChangePassword';
import requireAuth from '@/app/libs/requireAuth';
import React from 'react'

export const metadata = {
  title: 'Change Password Staff',
};

export default async function ChangePasswordStaffPage() {
  const currentUser = await GetCurrentUser();
  return requireAuth(
    <div>
      <ChangePassword currentUser={currentUser} />
    </div>,
    [3]
  );
}
