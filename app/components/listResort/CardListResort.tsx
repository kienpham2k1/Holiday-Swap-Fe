'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Carousel } from 'flowbite-react';
import { format } from 'date-fns';
import { AiFillStar } from 'react-icons/ai';
import useNewDateRange from '@/app/hooks/useNewDateRange';
import Link from 'next/link';

interface CardListResortProps {
  data: any;
}

const CardListResort: React.FC<CardListResortProps> = ({ data }) => {
  const route = useRouter();
  const newDateRange = useNewDateRange();

  const handleRedirectApartmentDetail = () => {
    newDateRange.setNew();
    route.refresh();
  };
  return (
    <div className="flex flex-col cursor-pointer ">
      <div>
        <Carousel
          slide={false}
          className="relative w-full h-[300px] rounded-xl z-40 object-cover  "
        >
          {data?.availableTime.coOwner.property.propertyImages.slice(0, 5).map((item: any) => (
            <Link
              target="_blank"
              href={`/apartment/${data.availableTime.id}?propertyId=${data.availableTime.coOwner.property.id}&roomId=${data.availableTime.coOwner.roomId}`}
              key={item.id}
              className="w-full h-full "
            >
              <Image
                onClick={handleRedirectApartmentDetail}
                src={item.link}
                alt="destination"
                fill
                className=" rounded-t-xl object-cover"
              />
            </Link>
          ))}
        </Carousel>
      </div>
      <div className="flex flex-row justify-between py-3 ">
        <Link
          href={`/apartment/${data.availableTime.id}?propertyId=${data.availableTime.coOwner.property.id}&roomId=${data.availableTime.coOwner.roomId}`}
          onClick={handleRedirectApartmentDetail}
          className="w-full"
          target="_blank"
        >
          <div className="text-base font-bold line-clamp-1">
            {data?.availableTime.coOwner.property.propertyName}
          </div>
          <div className="text-gray-600 text-base line-clamp-1">
            {data?.availableTime.coOwner.property.resort.resortName}
          </div>
          <div className="text-gray-600 text-base">
            Owner by:{' '}
            {data?.availableTime.coOwner.user.fullName
              ? data?.availableTime.coOwner.user.fullName
              : data?.availableTime.coOwner.user.username}
          </div>
          <div className="text-gray-600 text-base">
            Apartment ID:{' '}
            {data?.availableTime.coOwner.roomId}
          </div>
          <div className="text-gray-600 text-base">
            {new Date(data?.availableTime.startTime).getMonth() ===
            new Date(data?.availableTime.endTime).getMonth()
              ? `${format(new Date(data?.availableTime.startTime), 'd ')} -
          ${format(new Date(data?.availableTime.endTime), 'd MMM yyyy')}`
              : `${format(new Date(data?.availableTime.startTime), 'd MMM')} -
          ${format(new Date(data?.availableTime.endTime), 'd MMM yyyy')}`}
          </div>
          <div className="py-2 text-base">
            <div>
              <span className="font-bold">{data?.availableTime.pricePerNight} point</span>
              /night
            </div>
          </div>
        </Link>
        {data?.availableTime.coOwner.property?.rating && (
          <div className="">
            <div className="flex flex-row items-center gap-1">
              <AiFillStar color="orange" />
              <div>{Number(data?.availableTime.coOwner.property.rating).toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardListResort;
