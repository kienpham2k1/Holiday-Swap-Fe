'use client';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Heading from '../Heading';
import InputComponent from '../input/Input';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import useDeactiveResortModal from '@/app/hooks/useDeactiveResortModal';
import UploadImageCreateOwnership from './UploadImageCreateOwnership';
import { format } from 'date-fns';
import axios from 'axios';
import { Modal as ModalFlowbite, Button, Select, Textarea } from 'flowbite-react';
import ModalCreate from './ModalCreate';
import useChangeStatusIssueModal from '@/app/hooks/useChangeStatusIssueModal';
import Modal from './Modal';

export default function ModalChangeStatusIssue() {
  const router = useRouter();
  const changeStatusIssueModal = useChangeStatusIssueModal();
  const issueId = changeStatusIssueModal.issueId;
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const status = [
    {
      id: 1,
      value: 'RESOLVE',
    },
    {
      id: 2,
      value: 'REFUND',
    },
  ];

  const [statusValue, setStatusValue] = useState(status[0].value);

  const handleChangeStatus = (value: any) => {
    setStatusValue(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      issueDescription: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const body = {
      issueId: issueId,
      issueDescription: data.issueDescription,
      issueStatus: statusValue,
    };

    axios
      .put(`https://holiday-swap.click/api/v1/issues-booking/update-issue-booking`, body, {
        headers: { 'Content-type': 'application/json' },
      })
      .then(() => {
        toast.success('Change status successfully!');
        changeStatusIssueModal.onSuccess();
        changeStatusIssueModal.onClose();
        reset();
        setStatusValue('RESOLVE');
      })
      .catch((response) => {
        toast.error(response.response.data.message);
        changeStatusIssueModal.onClose();
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
        <div className="flex flex-col gap-1">
          <label>Issue description</label>
          <Textarea
            id="issueDescription"
            {...register('issueDescription', {
              required: true,
            })}
            placeholder="Issue description"
            required
            rows={4}
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

        <div className="flex flex-col gap-1 pt-3">
          <label>Select status</label>
          <Select
            value={statusValue}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeStatus(e.target.value)}
            required
          >
            {status.map((item) => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* <div>
          <label className="pb-1">Report Image</label>
         <UploadImageCreateOwnership
            handeChangeNewImages={handeChangeNewImages}
            handleDeleteImage={handleDeleteImage}
            mutiple={true}
          />
      </div> */}
      <ModalFlowbite show={openModal} onClose={() => setOpenModal(false)}>
        <ModalFlowbite.Header>Change status issue</ModalFlowbite.Header>
        <ModalFlowbite.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you want to change status issue?
            </p>
          </div>
        </ModalFlowbite.Body>
        <ModalFlowbite.Footer className="flex justify-end">
          <Button color="red" className="font-bold text-lg" onClick={handleSubmit(onSubmit)}>
            Continue
          </Button>
          <Button color="gray" className="text-lg" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </ModalFlowbite.Footer>
      </ModalFlowbite>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={changeStatusIssueModal.isOpen}
      title={'Change status issue'}
      actionLabel={'Continue'}
      onClose={changeStatusIssueModal.onClose}
      onSubmit={() => setOpenModal(true)}
      body={bodyContent}
    />
  );
}
