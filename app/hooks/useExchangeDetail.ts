import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import useExchange from '@/app/hooks/useExchange';
import {
  readConversationById,
  setCurrentConversationId,
  updateCountUnreadMessages,
} from '@/app/redux/slices/conversationSlice';
import MessageApis from '@/app/actions/MessageApis';
import { Message } from '@/app/actions/ConversationApis';
import { FullMessageType } from '@/app/components/chat/Body';
import * as React from 'react';
import { Booking } from '@/common/models';
import { log } from 'util';

type Props = {
  currentUser?: Object | any | null;
  conversationId: string;
  exchangerId: string;
  initialMessages: FullMessageType[];
  exchangeTrip: Booking;
  initialActiveStep: number;
  setYourTripStatus: (status: number) => void;
};
const useExchangeDetail = ({currentUser, initialMessages, conversationId, exchangerId, exchangeTrip, initialActiveStep, setYourTripStatus}: Props) => {
  const { exchangeId } = useExchange();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(initialActiveStep);
  const [exchangeTripData, setExchangeTripData] = useState<Booking>(exchangeTrip);
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const accessToken = session?.user?.access_token;

  useEffect(() => {
    if(!loading){
      dispatch(readConversationById(conversationId));
      dispatch(setCurrentConversationId(conversationId));
      MessageApis.markAsReadByConversationId(conversationId)
        .catch(err=> console.log(err));
    }
  }, [conversationId, dispatch, loading]);
  
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
      if (updatedClient) {
        updatedClient.onConnect = () => {
          updatedClient.subscribe(`/topic/${conversationId}`, (message) => {
            const newMessage =  JSON.parse(message.body) as Message;
            setMessages((current) => {
              return [...current, newMessage];
            })
            dispatch(updateCountUnreadMessages({ increment: 0, decrement: 1, conversationId: conversationId }));
            MessageApis.markAsReadByConversationIdEqualsAndMessageIdEquals(conversationId, newMessage?.messageId.toString())
              .catch(err=> console.log(err));
          }, {
            ['Authorization']: `${accessToken}`,
          });
          updatedClient.subscribe(`/topic/exchange-${exchangeId}-${exchangerId}`, (message) => {
            const newMessage =  JSON.parse(message.body) as Booking;
            setExchangeTripData(newMessage);
          }, {
            ['Authorization']: `${accessToken}`,
          });
          updatedClient.subscribe(`/topic/exchangeStep-${exchangeId}`, (message) => {
            const newMessage =  message.body as string;
            setActiveStep((current) => parseInt(newMessage, 10)??current);
            if(newMessage ==='0'){
              setYourTripStatus(0);
            }
          }, {
            ['Authorization']: `${accessToken}`,
          });
        };
        updatedClient.activate();
      }
      setClient(updatedClient);
      setLoading(false);
    }
    return ()=>{
      dispatch(setCurrentConversationId(null));
      client?.deactivate();
    }
  }, [accessToken]);


  return {
    exchangeId, client, loading, messages, activeStep, exchangeTripData
  };
};

export default useExchangeDetail;
