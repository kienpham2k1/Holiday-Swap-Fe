'use client';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef, useEffect, FC } from 'react';
import ClearDataButton from './ClearDataButton';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { Coords } from 'google-map-react-concurrent';
export interface LocationInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  setPlaceId: React.Dispatch<React.SetStateAction<string | null>>;
  setCoordinates?: React.Dispatch<React.SetStateAction<Coords | undefined>>;
}
const LocationInput: FC<LocationInputProps> = ({
  autoFocus = false,
  placeHolder = 'Location',
  desc = 'Where are you going?',
  className = 'nc-flex-1.5',
  divHideVerticalLineClass = 'left-10 -right-0.5',
  setPlaceId,
  setCoordinates,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [showPopover, setShowPopover] = useState(autoFocus);
  const { placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    usePlacesService({
      apiKey: 'AIzaSyDTZQ9gsIrh6G2_HtnX7pTgFS74G_VVedU',
    });
  const handleGetPlacePredictions = (item: string) => {
    if (!inputRef.current) return;
    if (inputRef.current.value.length < 2) return;
    getPlacePredictions({ input: item });
  };
  useEffect(() => {
    setShowPopover(autoFocus);
  }, [autoFocus]);
  useEffect(() => {
    if (eventClickOutsideDiv) {
      document.removeEventListener('click', eventClickOutsideDiv);
    }
    showPopover && document.addEventListener('click', eventClickOutsideDiv);
    return () => {
      document.removeEventListener('click', eventClickOutsideDiv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopover]);
  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);
  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setShowPopover(false);
  };
  const handleSelectLocation = (description: string, place_id: string) => {
    setValue(description);
    setPlaceId(place_id);
    console.log(description, place_id);
    const placeDetailsRequest = {
      placeId: place_id,
    };
    console.log(description, place_id);

    placesService?.getDetails(placeDetailsRequest, (place: any, status: any, google: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const coordinates = place?.geometry?.location;
        const longitude = coordinates?.lng();
        const latitude = coordinates?.lat();
        if (setCoordinates) {
          setCoordinates({ lat: latitude ?? 10.200809, lng: longitude ?? 103.96685 });
        }
        console.log('Longitude:', longitude);
        console.log('Latitude:', latitude);
      } else {
        console.error('An error occurred:', status);
      }
    });
    setShowPopover(false);
  };
  interface CoordinatesLookup {
    [key: string]: Coords;
  }
  const handleSelectLocationv2 = (description: string, place_id: string) => {
    setValue(description);
    setPlaceId(place_id);
    console.log(description, place_id);
    const coordinatesLookup:CoordinatesLookup = {
      "ChIJb4jMEXhncDERudweqAq8S1w": { lat: 12.2529152, lng: 109.1899018 },
      "ChIJ0en_g_GLpzERFBvXmwFqVk4": { lat: 10.2228734, lng: 103.9626259 },
      "ChIJ9QxPVdRvdTERQPpB9jvST7I": { lat: 10.4113797, lng: 107.136224 },
    };
    if (setCoordinates) {
      if (coordinatesLookup.hasOwnProperty(place_id)) {
        setCoordinates(coordinatesLookup[place_id]);
      }
    }
    setShowPopover(false);
  };
  const renderRecentSearches = () => {
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-xs xl:text-sm text-neutral-800 dark:text-neutral-100">
          Popular searches
        </h3>
        <div className="mt-2">
          {[
            {
              description: 'Nha Trang, Khanh Hoa, Vietnam',
              place_id: 'ChIJb4jMEXhncDERudweqAq8S1w',
            },
            {
              description: 'Phu Quoc, Kien Giang, Vietnam',
              place_id: 'ChIJ0en_g_GLpzERFBvXmwFqVk4',
            },
            {
              description: 'Vung Tau, Ba Ria - Vung Tau, Vietnam',
              place_id: 'ChIJ9QxPVdRvdTERQPpB9jvST7I',
            },
          ].map((item) => (
            <span
              onClick={() => handleSelectLocationv2(item.description, item.place_id)}
              key={item.place_id}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <ClockIcon className="h-4 sm:h-6 w-4 sm:w-6" />
              </span>
              <span className=" block font-medium text-neutral-700 dark:text-neutral-200">
                {item.description}
              </span>
            </span>
          ))}
        </div>
      </>
    );
  };
  const renderSearchValue = () => {
    return (
      <>
        {placePredictions &&
          placePredictions.map((item) => (
            <span
              onClick={() => handleSelectLocation(item.description, item.place_id)}
              key={item.description}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700 dark:text-neutral-200">
                {item.description}
              </span>
            </span>
          ))}
      </>
    );
  };
  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex z-10 flex-1 relative flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${
          showPopover ? 'nc-hero-field-focused' : ''
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 text-xs xl:text-sm placeholder-neutral-800 dark:placeholder-neutral-200 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              handleGetPlacePredictions(e.currentTarget.value);
            }}
            ref={inputRef}
          />
          <span className="block mt-0.5 text-xs xl:text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton
              onClick={() => {
                setValue('');
              }}
            />
          )}
        </div>
      </div>
      {showPopover && (
        <div
          className={`text-xs xl:text-sm absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {value && renderSearchValue()}
          {value.length < 2 && renderRecentSearches()}
        </div>
      )}
    </div>
  );
};
export default LocationInput;
