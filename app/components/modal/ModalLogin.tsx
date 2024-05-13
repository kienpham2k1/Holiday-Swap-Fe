'use client';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Heading from '../Heading';
import InputComponent from '../input/Input';
import Modal from './Modal';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import axios from 'axios';
import InputPassword from '../input/InputPassword';

export default function ModalLogin() {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
      emailForgot: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (isForgotPasswordModalOpen) {
      axios
        .post(`https://holiday-swap.click/api/v1/auth/forgot-password?email=${data.emailForgot}`)
        .then(() => {
          toast.success('Email has been sent to your mail. Please check and verify!');
          loginModal.onClose();
        })
        .catch((response) => {
          if (response && response.response.data) {
            toast.error(response.response.data.message);
          } else {
            toast.error('Something went wrong!');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      signIn('credentials', { ...data, redirect: false }).then(async (callback) => {
        setIsLoading(false);
        if (callback?.ok) {
          toast.success('Logged in');
          router.refresh();
          loginModal.onLogin();
          loginModal.onClose();
        }

        if (callback?.error) {
          toast.error('Invalid email or password');
        }
      });
    }
  };

  const toggleForgotPasswordModal = useCallback(() => {
    setIsForgotPasswordModalOpen(!isForgotPasswordModalOpen);
  }, [isForgotPasswordModalOpen]);

  const toggleCrbackLogin = useCallback(() => {
    setIsForgotPasswordModalOpen(false);
    router.push('/');
  }, []);

  const toggleCreateAccountModal = useCallback(() => {
    setIsForgotPasswordModalOpen(false);
    loginModal.onClose();
    router.push('/register');
  }, []);

  const onForgotPassword: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(false);
    axios
      .post(`https://holiday-swap.click/api/v1/auth/forgot-password?email=${data.emailForgot}`)
      .then(() => {
        toast.success(
          'An email has been sent to your email, please verify to recover your password'
        );
        loginModal.onClose();
      })
      .catch((response) => {
        toast.error(response.response.data.message);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        {isForgotPasswordModalOpen ? (
          <>
            <h2 className="text-2xl font-bold">Welcome to</h2>
            <span className="mx-1 text-2xl font-bold text-black">
              Holiday<span className="text-2xl text-common">Swap</span>
            </span>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">Welcome to</h2>
            <span className="mx-1 text-2xl font-bold text-black">
              Holiday<span className="text-2xl text-common">Swap</span>
            </span>
          </>
        )}
      </div>
      {isForgotPasswordModalOpen ? (
        <div className="grid grid-cols-1 gap-4">
          <InputComponent
            id="emailForgot"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <InputComponent
            id="email"
            label="Email"
            type="email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <InputPassword
            id="password"
            label="Password"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
      )}
    </div>
  );

  const renderFooterContent = () => {
    if (isForgotPasswordModalOpen) {
      return (
        <div className="flex items-center  pt-3">
          <span
            className="cursor-pointer text-neutral-800 hover:underline flex flex-row items-center gap-1"
            onClick={toggleCrbackLogin}
          >
            <span>
              <BiArrowBack size={20} />
            </span>
            Back to login
          </span>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1">
          <button
            className="text-common pb-2  flex flex-row justify-end w-full"
            onClick={toggleForgotPasswordModal}
          >
            <div className="hover:underline">Forgot password?</div>
          </button>

          <hr />
          <div className="text-neutral-500 text-center mt-4 font-light">
            <div className="flex flex-row justify-center items-center gap-2">
              <div>
                First time using{' '}
                <span className="font-bold text-black">
                  Holiday<span className="text-common">Swap</span>
                </span>
                ?
              </div>
              <div
                onClick={toggleCreateAccountModal}
                className="text-neutral-800 cursor-pointer hover:underline"
              >
                Create an account
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title={isForgotPasswordModalOpen ? 'Forgot Password' : 'Login'}
      actionLabel={isForgotPasswordModalOpen ? 'Reset Password' : 'Continue'}
      onClose={loginModal.onClose}
      onSubmit={isForgotPasswordModalOpen ? handleSubmit(onForgotPassword) : handleSubmit(onSubmit)}
      body={bodyContent}
      footer={renderFooterContent()}
    />
  );
}
