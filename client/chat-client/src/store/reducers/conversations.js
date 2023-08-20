import { ACTION_TYPE } from "../actions/constant";

const initialState = {
    conversations: [],
    selectedConversation: {}
};

initialState.selectedConversation = initialState?.conversations[0]?.conversationId;

const conversationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONVERSATIONS_LOADED': {
            const newState = { ...state };
            newState.conversations = action.payload.conversations ? action.payload.conversations : [];
            newState.selectedConversation = action.payload.selectedConversation;
            return newState;
        }
      case 'SELECTED_CONVERSATION_CHANGED': {
        const newState = { ...state };
        newState.selectedConversation = 
            newState.conversations.find(
                conversation => conversation.id === action.conversationId
            );

        return newState;
      }
      case 'DELETE_CONVERSATION': {
        if (state.selectedConversation) {
            const newState = { ...state };

            let selectedConversationIndex = 
                newState.conversations.findIndex(c => c.id === newState.selectedConversation.id);
            newState.conversations.splice(selectedConversationIndex, 1);

            if (newState.conversations.length > 0) {
                if (selectedConversationIndex > 0) {
                    --selectedConversationIndex;
                }
        
                newState.selectedConversation = newState.conversations[selectedConversationIndex];
            } else {
                newState.selectedConversation = null;
            }

            return newState;
        }
        
        return state;
      }
      default:
        return state;
    }
  }
  
export default conversationsReducer;