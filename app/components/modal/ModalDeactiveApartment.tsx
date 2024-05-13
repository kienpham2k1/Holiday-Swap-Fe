'use client';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Heading from '../Heading';
import InputComponent from '../input/Input';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import useDeactiveApartmentModal from '@/app/hooks/useDeactiveApartmentModal';
import UploadImageCreateOwnership from './UploadImageCreateOwnership';
import { format } from 'date-fns';
import axios from 'axios';
import { Modal, Button } from 'flowbite-react';
import ModalCreate from './ModalCreate';

export default function ModalDeactiveApartment() {
  const router = useRouter();
  const deactiveApartmentModal = useDeactiveApartmentModal();
  const propertyId = deactiveApartmentModal.propertyId;
  const roomId = deactiveApartmentModal.roomId;
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      startDateDeactive: '',
      propertyId: '',
      roomId: '',
    },
  });

  useEffect(() => {
    if (propertyId) {
      setValue('propertyId', propertyId);
    }

    if (roomId) {
      setValue('roomId', roomId);
    }
  }, [propertyId, roomId]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const formData = new FormData();

    const resortUpdateRequest = {
      propertyId: Number(data.propertyId),
      roomId: data.roomId,
      resortStatus: 'DEACTIVATE',
      startDate: format(new Date(data.startDateDeactive), 'yyyy-MM-dd') + 'T00:00',
      endDate: null,
    };

    const resortUpdatRequestBlob = new Blob([JSON.stringify(resortUpdateRequest)], {
      type: 'application/json',
    });
    formData.append('resortUpdateRequest', resortUpdatRequestBlob);
    file.forEach((element) => {
      formData.append('resortImage', element);
    });

    axios
      .put(`https://holiday-swap.click/api/co-owners/update-status`, formData)
      .then(() => {
        toast.success('Updated status successfully!');
        deactiveApartmentModal.onSuccess();
        deactiveApartmentModal.onClose();
        reset();
      })
      .catch((response) => {
        toast.error(response.response.data.message);
        deactiveApartmentModal.onClose();
      })
      .finally(() => {
        setIsLoading(false);
        setOpenModal(false);
      });
  };

  const handleDeleteImage = (image: any) => {
    setFile(file.filter((prev) => prev.size !== image.size));
  };

  const handeChangeNewImages = (image: any) => {
    if (image) {
      setFile((old) => [...old, image]);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-center">
        <InputComponent
          register={register}
          label="Start date deactive"
          required={true}
          id="startDateDeactive"
          type="date"
          errors={errors}
        />
      </div>

      <div>
        <label className="pb-1">Report Image</label>
        <UploadImageCreateOwnership
          handeChangeNewImages={handeChangeNewImages}
          handleDeleteImage={handleDeleteImage}
          mutiple={true}
        />
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Deactive apartment</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you want to deactive apartment?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="red" className="font-bold text-lg" onClick={handleSubmit(onSubmit)}>
            Continue
          </Button>
          <Button color="gray" className="text-lg" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  return (
    <ModalCreate
      disabled={isLoading}
      isOpen={deactiveApartmentModal.isOpen}
      title={'Deactive apartment'}
      actionLabel={'Deactive'}
      onClose={deactiveApartmentModal.onClose}
      onSubmit={() => setOpenModal(true)}
      body={bodyContent}
    />
  );
}
