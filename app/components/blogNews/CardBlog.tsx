'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import GetPostUser from '@/app/actions/getPostUser';
import useWriteBlogModal from '@/app/hooks/useWriteBlogModal';

interface CardBlogProps {
  post: any;
  currentUser: any;
}

const CardBlog: React.FC<CardBlogProps> = ({ post, currentUser }) => {
  const [postList, setPostList] = useState<any>(post);
  const axiosAuthClient = useAxiosAuthClient();
  const { data: session } = useSession();
  const router = useRouter();
  const writeBlogModal = useWriteBlogModal();
  const isSuccess = writeBlogModal.isSuccess;

  const handleLikePost = (postId: any) => {
    if (postId && currentUser) {
      const config = { headers: { Authorization: `Bearer ${session?.user.access_token}` } };
      axios
        .put(
          `https://holiday-swap.click/api/post/react?postId=${postId}&reaction=like`,
          null,
          config
        )
        .then(async () => {
          const newData = await axios.get(
            `https://holiday-swap.click/api/post/get?userId=${currentUser.userId}`
          );
          if (newData) {
            setPostList(newData.data);
          }
        })
        .catch((response) => {
          toast.error(response.response.data.message);
        });
    } else {
      toast.error('You must be login to like post!');
    }
  };

  const sortedItems = postList?.sort((a: any, b: any) => {
    const dateA = new Date(a.datePosted);
    const dateB = new Date(b.datePosted);

   
      return dateB.valueOf() - dateA.valueOf();
 
  });

  const handleDislikePost = (postId: any) => {
    if (postId && currentUser) {
      const config = { headers: { Authorization: `Bearer ${session?.user.access_token}` } };
      axios
        .put(
          `https://holiday-swap.click/api/post/react?postId=${postId}&reaction=dislike`,
          null,
          config
        )
        .then(async () => {
          const newData = await axios.get(
            `https://holiday-swap.click/api/post/get?userId=${currentUser.userId}`
          );
          if (newData) {
            setPostList(newData.data);
          }
        })
        .catch((response) => {
          toast.error(response.response.data.message);
        });
    } else {
      toast.error('You must be login to dislike post!');
    }
  };

  useEffect(() => {
    if (isSuccess === true) {
      const getNewData = async () => {
        const newData = await GetPostUser(currentUser.userId);
        setPostList(newData);
        writeBlogModal.onSuccessReset();
      };
      getNewData();
    }
  }, [isSuccess]);

  return (
    <div className="bg-white w-full h-auto ">
      {sortedItems?.map((item: any, index: number) => (
        <div key={item.id} className="shadow-sm border border-gray-200 rounded-xl mb-10">
          <div className="px-10 my-8 flex flex-col ">
            <div className="flex flex-row items-center justify-between">
              <div className="py-4 flex flex-row gap-2 items-center">
                <Image
                  src={item.avatar || '/images/placeholder.jpg'}
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <div className="text-gray-700 text-lg">
                    {item.fullName ? item.fullName : item.userName}
                  </div>
                  <div className="text-gray-700 text-base">
                    {format(new Date(item.datePosted), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-7">
                <div className="flex flex-row items-center">
                  <BiSolidLike
                    className="hover:cursor-pointer"
                    onClick={() => handleLikePost(item.id)}
                    size={30}
                    color={item.liked === true ? 'blue' : 'gray'}
                  />
                  <div className="text-lg font-thin ml-1 text-common">{item.likes}</div>
                  <div>{item.liked}</div>
                </div>

                <div className="flex flex-row items-center">
                  <BiSolidDislike
                    className="hover:cursor-pointer"
                    onClick={() => handleDislikePost(item.id)}
                    size={30}
                    color={item.disliked === true ? 'red' : 'gray'}
                  />
                  <div className="text-lg font-thin ml-1 text-common">{item.dislikes}</div>
                </div>
              </div>
            </div>
            <div className="text-[25px] pt-3 pb-5">{item.title}</div>

            <div>
              <Link
                href={`/blog/${item.id}`}
                className="bg-[#5C98F2] hover:cursor-pointer hover:bg-blue-600  w-[130px] h-[51px] flex flex-row items-center justify-center rounded-md mt-5 text-white font-medium"
                target="_blank"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardBlog;
