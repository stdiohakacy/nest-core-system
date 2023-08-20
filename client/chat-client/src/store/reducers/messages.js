import { ACTION_TYPE } from "../actions/constant";

const initialState = {
    messages: []
}

const messagesReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'MESSAGES_LOADED': {
            const newState = { ...state };
            newState.messages = action.payload.messages ? action.payload.messages : [];
            return newState;
        }

        case ACTION_TYPE.CREATE_MESSAGE: {
            const newState = { ...state };
            newState.messages = [...[action.payload.message], ...newState.messages, ]
            return newState;
        }
        default: 
            return state;
    }
}

export default messagesReducer;