'use client';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Heading from '../Heading';
import InputComponent from '../input/Input';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import useDeactiveResortModal from '@/app/hooks/useDeactiveResortModal';
import useMaintanceResortModal from '@/app/hooks/useMaintanceResortModal';
import { FaLongArrowAltRight } from 'react-icons/fa';
import ModalCreate from './ModalCreate';
import UploadImageCreateOwnership from './UploadImageCreateOwnership';
import { format } from 'date-fns';
import axios from 'axios';
import { Modal, Button } from 'flowbite-react';

export default function ModalMaintanceResort() {
  const router = useRouter();
  const maintanceResortModal = useMaintanceResortModal();
  const resortId = maintanceResortModal.resortId;
  const resortStatus = maintanceResortModal.resortStatus;
  const isMaintanceProperty = maintanceResortModal.isMaintanceProperty;
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [file, setFile] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      startDateMaintance: '',
      endDateMaintance: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const formData = new FormData();

    let resortUpdateRequest;

    if (isMaintanceProperty === true) {
      resortUpdateRequest = {
        propertyId: resortId,
        resortStatus: resortStatus,
        startDate: format(new Date(data.startDateMaintance), 'yyyy-MM-dd') + 'T00:00',
        endDate: format(new Date(data.endDateMaintance), 'yyyy-MM-dd') + 'T00:00',
      };
    } else {
      resortUpdateRequest = {
        resortId: resortId,
        resortStatus: resortStatus,
        startDate: format(new Date(data.startDateMaintance), 'yyyy-MM-dd') + 'T00:00',
        endDate: format(new Date(data.endDateMaintance), 'yyyy-MM-dd') + 'T00:00',
      };
    }

    const resortUpdatRequestBlob = new Blob([JSON.stringify(resortUpdateRequest)], {
      type: 'application/json',
    });
    formData.append('resortUpdateRequest', resortUpdatRequestBlob);
    file.forEach((element) => {
      formData.append('resortImage', element);
    });

    if (isMaintanceProperty === true) {
      axios
        .put(`https://holiday-swap.click/api/v1/properties/updateStatus`, formData)
        .then(() => {
          toast.success('Updated status successfully!');
          maintanceResortModal.onSuccess();
          maintanceResortModal.onClose();
          maintanceResortModal.onMaintancePropertyReset();
          reset();
        })
        .catch((response) => {
          toast.error(response.response.data.message);
          maintanceResortModal.onClose();
        })
        .finally(() => {
          setIsLoading(false);
          setOpenModal(false);
        });
    } else {
      axios
        .put(`https://holiday-swap.click/api/v1/resorts/updateStatus`, formData)
        .then(() => {
          toast.success('Updated status successfully!');
          maintanceResortModal.onSuccess();
          maintanceResortModal.onClose();
          reset();
        })
        .catch((response) => {
          toast.error(response.response.data.message);
          maintanceResortModal.onClose();
        })
        .finally(() => {
          setIsLoading(false);
          setOpenModal(false);
        });
    }
  };

  const toggleCreateAccountModal = useCallback(() => {
    setIsForgotPasswordModalOpen(false);
    maintanceResortModal.onClose();
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <InputComponent
            register={register}
            label="Start date maintance"
            required={true}
            id="startDateMaintance"
            type="date"
            errors={errors}
          />
          <InputComponent
            register={register}
            label="End date maintance"
            required={true}
            id="endDateMaintance"
            type="date"
            errors={errors}
          />
        </div>
        {/* <InputComponent
          register={register}
          label="Script"
          required={true}
          id="script"
          type="text"
          errors={errors}
        /> */}
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
        <Modal.Header>
          Maintenance {isMaintanceProperty === true ? 'property' : 'resort'}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you want to maintenance {isMaintanceProperty === true ? 'property' : 'resort'}?
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
      isOpen={maintanceResortModal.isOpen}
      title={isMaintanceProperty === true ? 'Maintance Property' : 'Maintance Resort'}
      actionLabel={'Maintance'}
      onClose={maintanceResortModal.onClose}
      onSubmit={() => setOpenModal(true)}
      body={bodyContent}
    />
  );
}
