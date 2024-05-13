import React from 'react';
import { Layout } from 'antd';
import GetCurrentUser from '@/app/actions/getCurrentUser';
import requireAuth from '@/app/libs/requireAuth';

export default async function ExchangeLayout({ children }: { children: React.ReactNode }) {
  return requireAuth(
    <>
      <div className='flex flex-row pt-16 h-screen'>
        <main className='pt-[0.9rem] w-full'>
          <Layout className='bg-gray-200 h-screen custom-max-height'>
            <Layout>
              <div className='h-screen custom-max-height'>{children}</div>
            </Layout>
          </Layout>
        </main>
      </div>
    </>,
    [2],
  );
}
