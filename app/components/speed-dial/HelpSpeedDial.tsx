'use client';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { SiLivechat, SiZalo } from 'react-icons/si';
import { FaDiscord, FaFacebookMessenger } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa6';
import { GiSightDisabled } from 'react-icons/gi';
import Draggable from 'react-draggable';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Box, Typography } from '@mui/material';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import Avatar from '@mui/material/Avatar';
import { FilePond, registerPlugin } from 'react-filepond';

import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import ConversationApis from '@/app/actions/ConversationApis';
import MessageApis from '@/app/actions/MessageApis';
import LiveChatBody, { FullMessageType } from '@/app/components/chat/LiveChatBody';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview);

interface Props {
  currentUser?: any | null;
}

const CustomHelpIcon: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 0.5, color: '#58400D', textTransform: 'none', lineHeight: 'inherit' }}>
    <HelpIcon />
    <Typography fontWeight={700}>Help</Typography>
  </Box>
);

const CustomCloseIcon: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 0.5, color: '#58400D', textTransform: 'none', lineHeight: 'inherit' }}>
    <Typography fontWeight={700}>Close</Typography>
    <CancelIcon />
  </Box>
);


const HelpSpeedDial: React.FC<Props> = ({ currentUser }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openLiveChat, setOpenLiveChat] = useState(false);
  const [conversationId, setConversationId] = useState(0);
  const [initialMessages, setInitialMessages] = useState<FullMessageType[]>([]);
  const [conversationMessageLoading, setConversationMessageLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleHiddenClick = () => {
    setHidden(!hidden);
  };

  const handleClickLiveChat = () => {
    setOpenLiveChat(!openLiveChat);
    open && setOpen(!open);
    setHidden(!openLiveChat);
    if (openLiveChat) {
      ConversationApis.getSupportConversation()
        .then((res) => {
          res?.conversationId && setConversationId(res?.conversationId);
        })
        .catch((err) => {
          ConversationApis.createSupportConversation()
            .then((res) => {
              res?.conversationId && setConversationId(res?.conversationId);
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
  };

  const imageInput = useRef<FilePond>(null);
  const [files, setFiles] = useState<any>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    const formData = new FormData();
    formData.append('text', data.message);
    formData.append('authorId', currentUser?.userId);
    if (files[0]?.file) {
      formData.append('image', files[0]?.file ?? '');
    }
    MessageApis.sendMessage(conversationId.toString(), formData).then((response) => {
      console.log('result', JSON.stringify(response.data));
    }).catch((err) => {
      console.log(err);
    });
    setFiles([]);
  };

  const actions = [
    currentUser ? { icon: <SiLivechat size={24} onClick={handleClickLiveChat} />, name: 'Live Chat' } : null,
    { icon: <SiZalo size={24} />, name: 'Zalo' },
    { icon: <FaFacebookMessenger size={24} />, name: 'Messenger' },
    { icon: <FaDiscord size={24} />, name: 'Discord' },
    { icon: <FaRobot size={24} />, name: 'Bot' },
    { icon: <GiSightDisabled size={24} onClick={handleHiddenClick} />, name: 'Disable' },
  ].filter(action => action !== null);

  useEffect(() => {
    if (conversationId != 0) {
      setConversationMessageLoading(true);
      MessageApis.getMessagesByConversationId(conversationId.toString())
        .then((res) => {
          setInitialMessages(res?.reverse());
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setConversationMessageLoading(false);
        });
    }
  }, [conversationId]);

  return (
    <>
      <Draggable nodeRef={nodeRef}>
        <SpeedDial
          ref={nodeRef}
          onClose={handleClose}
          onClick={handleClick}
          open={open}
          hidden={hidden}
          ariaLabel='SpeedDial basic example'
          sx={{ position: 'fixed', bottom: 16, left: 16 }}
          FabProps={{ size: 'medium', style: { backgroundColor: '#F7A800' }, variant: 'extended' }}
          icon={open ? <CustomCloseIcon /> : <CustomHelpIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              className='no-cursor'
              key={action?.name}
              FabProps={{ style: { backgroundColor: '#F7A800', whiteSpace: 'nowrap', maxWidth: 'none' } }}
              icon={action?.icon}
              tooltipOpen
              tooltipPlacement={'right'}
              tooltipTitle={action?.name}
            />
          ))}
        </SpeedDial>
      </Draggable>
      {openLiveChat && <Draggable>
        <Box
          className={'no-cursor'}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 2,
            backgroundColor: '#fff',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            zIndex: 9999,
            width: '360px',
            height: '572px',
            maxHeight: 'calc(90vh-32px)',
            opacity: '1',
            // transitionDuration: '250ms',
            // transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          }}
        >
          <div
            className='cursor w-full flex border-b-[1px] dark:border-b-gray-600 sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm rounded-t-lg bg-[#F7A800]'>
            <div className='flex gap-3 items-center'>
              <div className='relative'>
                <div className='rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
                  <Avatar
                    src={`https://img.favpng.com/0/19/5/computer-icons-service-sales-technical-support-png-favpng-nHFCXGef8TMGzPucYu3a4Je0D.jpg`}
                    alt={`Chat Support`} />
                </div>
              </div>

              <div className='flex flex-col'>
                <div>
                  Chat Support
                </div>
              </div>
            </div>
            <CloseIcon
              onClick={handleClickLiveChat}
            />
          </div>

          {/*<div className='bg-gray-50 flex-1 overflow-y-auto dark:bg-black'>*/}

          {/*  <div className='pt-24' ref={bottomRef} />*/}
          {/*</div>*/}
          {conversationId != 0 && initialMessages && currentUser && !conversationMessageLoading &&
            <LiveChatBody initialMessages={initialMessages} conversationId={conversationId.toString()} currentUser={currentUser} />}

          <div className={`bg-transparent w-full chat-image-preview ${files && files?.length ? '' : 'hidden'}`}>
            <FilePond
              allowMultiple={false}
              allowReorder={true}
              allowPaste={false}
              maxFiles={1}
              instantUpload={false}
              credits={false}
              ref={imageInput}
              files={files}
              onupdatefiles={setFiles}
              labelIdle={''}
            />
          </div>
          <div
            className='pb-2 pt-4 px-2 bg-white border-t dark:border-t-gray-600 flex items-center gap-1 lg:gap-2 w-full rounded-b-lg'>
            {imageInput && <button className='filepond--label-action' onClick={() => {
              console.log('a');
              if (imageInput) imageInput?.current?.browse();
            }}>
              <HiPhoto size={32} className='text-[#F7A800]' />
            </button>}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex items-center gap-2 lg:gap-4 w-full'
            >
              <div className='relative w-full'>
                <input
                  id='message'
                  autoComplete={'message'}
                  {...register('message', { required: true })}
                  placeholder='Write a message'
                  className='text-black dark:text-white text-sm font-light py-1.5 px-4 bg-neutral-100 dark:bg-neutral-900 w-full rounded-full focus:outline-none'
                />
              </div>
              <button
                type='submit'
                className='rounded-full p-2 cursor-pointer bg-[#F7A800] hover:bg-amber-500 transition'
              >
                <HiPaperAirplane size={18} className='text-white' />
              </button>
            </form>
          </div>
        </Box>
      </Draggable>}

    </>
  );
};
export default HelpSpeedDial;