"use client";

import axios from "axios";
import { find } from "lodash";
import React, { useEffect, useRef, useState } from "react";

import MessageBox from "./MessageBox";
import { Message } from '@/app/actions/ConversationApis';
import { User } from '@/app/actions/UserApis';
import useConversation from '@/app/hooks/useConversation';
import { Client } from '@stomp/stompjs';
import { useSession } from 'next-auth/react';
import { accessToken } from 'mapbox-gl';
import { NotificationResponse } from '@/app/components/notification/types';
import { fetchNotifications } from '@/app/redux/slices/pushNotificationSlice';
import { Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import {
  readConversationById,
  setCurrentConversationId,
  updateCountUnreadMessages,
} from '@/app/redux/slices/conversationSlice';
import MessageApis from '@/app/actions/MessageApis';

// export type FullMessageType = Message & {
//   sender: User;
//   seen: User[];
// };
export type FullMessageType = Message;

type Props = {
  initialMessages: FullMessageType[];
  users: User[];
  currentUser?: Object | any | null;
};

function Body({ initialMessages, users, currentUser }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(true);
  const { conversationId } = useConversation();
  const [client, setClient] = useState<Client | null>(null);
  const [wsState, setWsState] = useState<'connected' | 'disconnected'>();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const accessToken = session?.user?.access_token;

  useEffect(() => {
    if(!loading){
      bottomRef?.current?.scrollIntoView();
      dispatch(readConversationById(conversationId));
      dispatch(setCurrentConversationId(conversationId));
      MessageApis.markAsReadByConversationId(conversationId)
        .catch(err=> console.log(err));
    }
  }, [conversationId, loading]);

  useEffect(() => {
    setLoading(true);
    if (accessToken) {
      const updatedClient = new Client({
        brokerURL: 'wss:///api.holiday-swap.click/websocket',
        connectHeaders: {
          ['Authorization']: `${accessToken}`,
        },
        reconnectDelay: 2000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });
      setClient(updatedClient);
    }

  }, [accessToken]);

  useEffect(() => {
    if (client) {
      client.onConnect = () => {
        client.subscribe(`/topic/${conversationId}`, (message) => {
          const newMessage =  JSON.parse(message.body) as Message;
          setMessages((current) => {
            return [...current, newMessage];
          })
          dispatch(updateCountUnreadMessages({ increment: 0, decrement: 1, conversationId: conversationId }));
          MessageApis.markAsReadByConversationIdEqualsAndMessageIdEquals(conversationId, newMessage?.messageId.toString())
            .catch(err=> console.log(err));
          // bottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          bottomRef?.current?.scrollTo(0, bottomRef?.current?.scrollHeight);
        }, {
          ['Authorization']: `${accessToken}`,
        });
      };
      client.activate();
      setLoading(false);
    }
    return () => {
      setLoading(true);
      dispatch(setCurrentConversationId(null));
      client?.deactivate();
    };
  }, [accessToken, client, conversationId, initialMessages]);




  // useEffect(() => {
  //   axios.post(`/api/conversations/${conversationId}/seen`);
  // }, [conversationId]);

  // useEffect(() => {
  //   pusherClient.subscribe(conversationId);
  //   bottomRef?.current?.scrollIntoView();
  //
  //   const messageHandler = (message: FullMessageType) => {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //
  //     setMessages((current) => {
  //       if (find(current, { id: message.id })) {
  //         return current;
  //       }
  //
  //       return [...current, message];
  //     });
  //
  //     bottomRef?.current?.scrollIntoView();
  //   };
  //
  //   const updateMessageHandler = (newMessage: FullMessageType) => {
  //     setMessages((current) =>
  //       current.map((currentMessage) => {
  //         if (currentMessage.id === newMessage.id) {
  //           return newMessage;
  //         }
  //
  //         return currentMessage;
  //       })
  //     );
  //   };
  //
  //   pusherClient.bind("messages:new", messageHandler);
  //   pusherClient.bind("message:update", updateMessageHandler);
  //
  //   return () => {
  //     pusherClient.unsubscribe(conversationId);
  //     pusherClient.unbind("messages:new", messageHandler);
  //     pusherClient.unbind("message:update", updateMessageHandler);
  //   };
  // }, [conversationId]);
  return (
    <>
      {loading ? (
        <div className="flex-1 overflow-y-auto dark:bg-black">
          <Skeleton />
        </div>
      ) : (
        <div className="bg-gray-50 flex-1 overflow-y-auto dark:bg-black">
          {messages.map((message, index) => (
            <MessageBox
              isLast={index === messages.length - 1}
              key={message.messageId}
              data={message}
              users={users}
              currentUser={currentUser}
            />
          ))}
          <div className="pt-24" ref={bottomRef} />
        </div>
      )}
    </>
  );
}

export default Body;