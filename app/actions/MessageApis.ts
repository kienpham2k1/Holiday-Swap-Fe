import AxiosClient from '@/app/libs/AxiosConfig';
import { Conversation } from '@/app/actions/ConversationApis';

export interface Message {
  messageId: number;
  text: string;
  image: string | null;
  createdOn: string;
  authorId: number;
  messageType: "TEXT" | "TEXT_AND_IMAGE" | string;
}

const MessageApis = {
  getMessagesByConversationId: (conversationId: string): Promise<Message[]> => AxiosClient.get(`/message/${conversationId}/messages`),
  sendMessage: (conversationId: string, message: FormData): Promise<any> => AxiosClient.post(`/message/${conversationId}/send`, message, {
    headers: {
      "Content-Type": "multipart/form-data",
    }}),
  markAsReadByConversationIdEqualsAndMessageIdEquals: (conversationId: string, messageId: string): Promise<Conversation> => AxiosClient.patch(`/message/${conversationId}/${messageId}/read`),
  markAsReadByConversationId: (conversationId: string): Promise<Conversation> => AxiosClient.patch(`/message/${conversationId}/read-all`),
};

export default MessageApis;