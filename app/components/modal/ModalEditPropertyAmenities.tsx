'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import InputComponent from '../input/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Textarea, Label, Select } from 'flowbite-react';
import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';
import toast from 'react-hot-toast';
import useEditPropertyViewModal from '@/app/hooks/useEditPropertyViewModal';
import useEditResortAmenitiesModal from '../../hooks/useEditResortAmenitiesModal';
import UploadContractApartment from '../register/UploadContractApartment';
import UploadImageCreateOwnership from './UploadImageCreateOwnership';
import UploadImageResortEdit from '../staff/UploadImageResortEdit';
import UploadImageAmenities from '../staff/UploadImageAmenities';
import ModalCreate from './ModalCreate';
import { useRouter } from 'next/navigation';
import useEditPropertyAmenitiesModal from '@/app/hooks/useEditPropertyAmenitiesModal';

export default function ModalEditPropertyAmenities() {
  const [isLoading, setIsLoading] = useState(false);
  const editPropertyAmenitiesModal = useEditPropertyAmenitiesModal();
  const resortAmenities = editPropertyAmenitiesModal.resortAmenities;
  const amenitiesType = editPropertyAmenitiesModal.amenitiesType;
  const [images, setImages] = useState<any[]>();
  const [oldImages, setOldImages] = useState<any>();
  const axiosAuthClient = useAxiosAuthClient();
  const [amenityId, setAmenityId] = useState();
  const [file, setFile] = useState<any[]>([]);
  const router = useRouter();

  const handleDeleteImages = () => {
    setOldImages(null);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      inRoomAmenityName: '',
      inRoomAmenityDescription: '',
    },
  });

  useEffect(() => {
    if (resortAmenities) {
      setAmenityId(resortAmenities.inRoomAmenityTypeId);
      setValue('inRoomAmenityName', resortAmenities.inRoomAmenityName);
      setValue('inRoomAmenityDescription', resortAmenities.inRoomAmenityDescription);
      setOldImages(resortAmenities.inRoomAmenityLinkIcon);
      setImages(resortAmenities.inRoomAmenityLinkIcon);
    }
  }, [resortAmenities]);

  const handleDeleteImage = (image: any) => {
    setFile(file.filter((prev) => prev.size !== image.size));
  };

  const handeChangeNewImages = (image: any) => {
    if (image) {
      setOldImages(image);
    }
  };

  const handleChangeAmenityId = (value: any) => {
    setAmenityId(value);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const config = { headers: { 'Content-type': 'application/json' } };

    const formData = new FormData();
    const resortAmenity = {
      inRoomAmenityName: data.inRoomAmenityName,
      inRoomAmenityDescription: data.inRoomAmenityDescription,
      inRoomAmenityTypeId: amenityId,
    };

    const resortAmenityBlob = new Blob([JSON.stringify(resortAmenity)], {
      type: 'application/json',
    });
    formData.append('inRoomAmenity', resortAmenityBlob);
    formData.append('inRoomAmenityIcon', oldImages);

    axiosAuthClient
      .put(`https://holiday-swap.click/api/v1/in-room-amenities/${resortAmenities?.id}`, formData)
      .then(() => {
        toast.success('Update Resort Amenity success!');
        editPropertyAmenitiesModal.onClose();
        editPropertyAmenitiesModal.onSuccess();
      })
      .catch((response) => {
        toast.error(response.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <InputComponent
        label="Property Amenity Name"
        id="inRoomAmenityName"
        errors={errors}
        register={register}
        required
      />
      <div className="w-full">
        <div className="mb-2 block">
          <label>Property Amenity Description</label>
        </div>
        <Textarea
          id="inRoomAmenityDescription"
          placeholder="Description"
          required
          rows={4}
          {...register('inRoomAmenityDescription')}
        />
      </div>

      <div>
        <Label value="Property Amenity Type" />
        <Select
          value={amenityId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeAmenityId(e.target.value)}
        >
          {amenitiesType?.content?.map((item: any, index: number) => (
            <option key={item?.id} value={item?.id}>
              {item?.inRoomAmenityTypeName}
            </option>
          ))}
        </Select>
      </div>

      <UploadImageAmenities
        resortImages={oldImages}
        handleDeleteImages={handleDeleteImages}
        handeChangeNewImages={handeChangeNewImages}
      />
    </div>
  );
  return (
    <ModalCreate
      disabled={isLoading}
      isOpen={editPropertyAmenitiesModal.isOpen}
      title="Edit property amenities"
      actionLabel="Submit"
      onClose={editPropertyAmenitiesModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}
