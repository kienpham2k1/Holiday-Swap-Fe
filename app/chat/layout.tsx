import React from 'react';
import GetConversations from '../actions/getConversations';
import ConversationList from '../components/chat/ConversationList';
import { Layout } from 'antd';
import GetCurrentUser from '@/app/actions/getCurrentUser';
import requireAuth from '@/app/libs/requireAuth';

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const conversations = await GetConversations();
  const currentUser = await GetCurrentUser();
  return requireAuth(
    <>
      {/* <Provider> */}
      <div className='flex flex-row pt-16 h-screen'>
        <main className='pt-[0.9rem] w-full'>
          <Layout className='bg-gray-200 h-screen custom-max-height'>
              <ConversationList initialItems={conversations} currentUser={currentUser} />
            <Layout>
              <div className='h-screen custom-max-height'>{children}</div>
            </Layout>
          </Layout>
        </main>
      </div>
      {/* </Provider> */}
    </>,
    [1, 2, 3, 4],
  );
}
