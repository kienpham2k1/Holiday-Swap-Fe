import { PayloadAction, createAsyncThunk, createSlice, createStore } from '@reduxjs/toolkit';
import ConversationApis, { Conversation, Participant } from '@/app/actions/ConversationApis';

export const fetchConversation = createAsyncThunk('conversation/fetchConversation', async (_, thunkApi) => {
  try {
    return await ConversationApis.getCurrentUserConversation();
  } catch (error) {
    thunkApi.dispatch(removeConversations());
    return Promise.reject(error);
  }
});

const initialState = {
  loading: false,
  loaded: false,
  data: [] as Conversation[],
  supportId: 0,
  countUnreadMessages: 0,
  currentConversationId: null,
  currentUserId: null,
};

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversationLoading: (state, action) => {
      state.loading = action.payload;
    },
    setConversationLoaded: (state, action) => {
      state.loaded = action.payload;
    },
    fetchConversations: (state, action) => {
      state.data = action.payload;
      state.countUnreadMessages = state.data.reduce((acc, item) => {
        const countReadByConversation = (item?.participants || [])
          .filter(participant => participant?.user?.userId === state.currentUserId)
          .reduce((unreadCount, participant) => unreadCount + (participant?.countUnreadMessages || 0), 0);
        return acc + (item?.conversationId !== state.currentConversationId ? countReadByConversation : 0);
      }, 0);
    },
    fetchConversationsV2: (state, action) => {
      state.data = action.payload;
    },
    removeConversations: (state) => {
      state.data = initialState.data;
    },
    readAllConversations: (state) => {
    },
    readConversationById(state, action) {
      state.data = state.data.map((item) => {
        if (item.conversationId.toString() === action.payload.toString()) {
          const participantIndex = item?.participants?.findIndex(
            (participant) => participant?.user?.userId === state.currentUserId
          );
          if (participantIndex !== -1 && item?.participants && participantIndex) {
            state.countUnreadMessages = state.countUnreadMessages - (item?.participants[participantIndex]?.countUnreadMessages ?? 0);
            const updatedParticipant = {
              ...item.participants[participantIndex],
              countUnreadMessages: 0,
            };
            return {
              ...item,
              participants: [
                ...item?.participants?.slice(0, participantIndex),
                updatedParticipant,
                ...item?.participants?.slice(participantIndex + 1),
              ],
            };
          }
        }
        return item;
      })
    },
    setCurrentUserId(state, action) {
      state.currentUserId = action.payload;
    },
    setCurrentConversationId(state, action) {
      state.currentConversationId = action.payload;
    },
    updateCountUnreadMessages: (state, action) => {
      const { increment, decrement, conversationId } = action.payload;
      state.data = state.data.map((item) => {
        if (item?.conversationId.toString() !== state?.currentConversationId && item?.conversationId.toString() === conversationId.toString()) {
          const participantIndex = item?.participants?.findIndex(
            (participant) => participant?.user?.userId === state.currentUserId
          );

          if (participantIndex !== -1 && item?.participants && participantIndex) {
            state.countUnreadMessages = state.countUnreadMessages + increment - decrement;
            const updatedParticipant = {
              ...item.participants[participantIndex],
              countUnreadMessages: (item.participants[participantIndex].countUnreadMessages || 0) + increment - decrement,
            };

            return {
              ...item,
              participants: [
                ...item?.participants.slice(0, participantIndex),
                updatedParticipant,
                ...item?.participants.slice(participantIndex + 1),
              ],
            };
          }
        }
        return item;
      });
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConversation.rejected, (state) => {
        state.loading = true;
        state.data = {
          ...initialState.data,
        };
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setConversationLoading,
  fetchConversations,
  removeConversations,
  setConversationLoaded,
  readAllConversations,
  readConversationById,
  setCurrentUserId,
  setCurrentConversationId,
  updateCountUnreadMessages,
  fetchConversationsV2
} = conversationSlice.actions;
export default conversationSlice.reducer;