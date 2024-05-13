'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import SearchBanner from './SearchBanner';

interface BannerProps {
  listResort: any;
}

const Banner: React.FC<BannerProps> = ({ listResort }) => {
  return (
    <div className="flex-1 py-4">
      <div className="flex gap-8 space-x-5 w-full">
        <div className="min-w-full w-28 z-20">
          <div className="text-black text-[40px] md:text-[54px] xl:text-[64px] ">
            Find new holiday to <span className="text-common">exchange</span> and enjoy
          </div>
          <div className="text-[#8c8c8c] py-14 text-sm px-3 md:px-0 md:text-base">
            Exchange and explore great places. Enjoy your vacation in the most optimal and flexible
            way possible with{' '}
            <span>
              Holiday<span className="text-common">Swap</span>
            </span>
          </div>
          <SearchBanner listResort={listResort} />
        </div>
        <Image
          alt="banner"
          src="/images/banner.jpeg"
          width={600}
          height={1080}
          className="object-cover hidden md:block md:w-[359px] lg:w-[520px] rounded-[50px] relative xl:w-[1080px]"
          blurDataURL="/images/banner.jpeg"
          placeholder="blur"
        />
      </div>
    </div>
  );
};

export default Banner;
