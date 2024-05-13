import AxiosClient from '@/app/libs/AxiosConfig';
import { User } from '@/app/actions/UserApis';

export interface Message {
  messageId: number;
  text: string;
  image: string | null;
  createdOn: string;
  authorId: number;
  messageType: "TEXT" | "TEXT_AND_IMAGE" | string;
}

export interface Participant {
  leftChat: boolean;
  user: User;
  messageId: number | null;
  countUnreadMessages: number | null;
  createdOn: string;
  lastModifiedOn: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface Conversation {
  conversationId: number;
  creationDate?: string | null;
  conversationName?: string | null;
  participants?: Participant[] | null;
  message?: Message | null;
}


const ConversationApis = {
  getCurrentUserConversation: (): Promise<Conversation[]> => AxiosClient.get('/conversation/current-user'),
  createConversation: (conversationName: string, userIds: number[]): Promise<Conversation> => AxiosClient.post('/conversation/create', {
    conversationName,
    userIds,
  }),
  getContactWithOwner: (userId: string): Promise<any> => AxiosClient.get(`/conversation/current-user/contact/${userId}`),
  createCurrentUserConversation: (userId: string): Promise<Conversation> => AxiosClient.post(`/conversation/current-user/contact/${userId}`),
  getSupportConversation: ():Promise<Conversation> => AxiosClient.get(`/conversation/current-user/support`),
  createSupportConversation: (): Promise<Conversation> => AxiosClient.post(`/conversation/current-user/support`),
  getParticipantsByConversationId: (conversationId: string): Promise<Participant[]> => AxiosClient.get(`/conversation/${conversationId}/participants`),
};

export default ConversationApis;