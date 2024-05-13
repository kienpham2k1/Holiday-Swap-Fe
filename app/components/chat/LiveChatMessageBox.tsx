'use client';

import clsx from 'clsx';
import { format, formatRelative } from 'date-fns';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Image } from 'antd';
import React, { useState } from 'react';
import { FullMessageType } from '@/app/components/chat/Body';
import { User } from '@/app/actions/UserApis';
import Avatar from '@mui/material/Avatar';

type Props = {
  data: FullMessageType;
  isLast?: boolean;
  currentUser?: Object | any | null;
};

function LiveChatMessageBox({ data, isLast, currentUser }: Props) {
  const session = useSession();
  const isOwn = data?.authorId.toString() === currentUser?.userId.toString();

  const container = clsx(`flex gap-3 p-4`, isOwn && 'justify-end');
  const body = clsx(`flex items-start gap-2.5`, isOwn && 'flex-row-reverse');
  const message = clsx(
    isOwn ? 'bg-sky-400 text-end' : 'bg-gray-100 dark:bg-gray-700',
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className={container}
    >
      <div className={body}>
        {!isOwn && (
          <div className='rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
            <Avatar
              src={`https://img.favpng.com/0/19/5/computer-icons-service-sales-technical-support-png-favpng-nHFCXGef8TMGzPucYu3a4Je0D.jpg`}
              alt={`Chat Support`} />
          </div>
        )}
        <div className={`flex flex-col gap-1`}>
          <div
            className={`flex flex-col w-full max-w-[350px] leading-1.5 p-4 border-gray-200 ${message} ${isOwn ? 'rounded-s-xl rounded-ee-xl' : 'rounded-e-xl rounded-es-xl'}`}>
            <div className={`flex items-center space-x-2 mb-2 ${isOwn ? 'space-x-reverse flex-row-reverse' : ''}`}>
              {(!isOwn) && (
                <span
                  className='text-sm font-semibold text-gray-900 dark:text-white'>Holiday-Swap</span>
              )}
              <span
                className={`text-sm font-normal text-gray-500 dark:text-gray-400 ${isOwn && 'text-white'}`}>{formatRelative(new Date(data.createdOn), new Date())}</span>
            </div>
            {data.text && data.text.length > 0 && (
              <p
                className={`text-sm font-normal text-gray-900 dark:text-white ${isOwn && 'text-white !font-semibold'}`}>{data.text}</p>)}
            {data.image && (<div className='group relative my-2.5'>
              <Image
                alt='Image'
                width={320}
                src={data.image}
                className='object-cover cursor-pointer hover:scale-110 transition translate'
              />
            </div>)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LiveChatMessageBox;
