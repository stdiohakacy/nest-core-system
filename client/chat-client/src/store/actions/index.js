import { ACTION_TYPE } from "./constant";

export const conversationChanged = conversationId => ({
    type: ACTION_TYPE.SELECTED_CONVERSATION_CHANGED,
    conversationId
});

export const conversationsRequested = () => ({
    type: ACTION_TYPE.CONVERSATIONS_REQUESTED
});

export const conversationDeleted = () => ({
    type: ACTION_TYPE.DELETE_CONVERSATION
});

export const newMessageAdded = message => {
    return {
        type: ACTION_TYPE.CREATE_MESSAGE,
        payload: {
            message
        }
    }
}

export const messageCreated = message => {
    return {
        type: ACTION_TYPE.CREATED_MESSAGE,
        payload: {
            message
        }
    }
}

export const messagesRequested = (messages) => ({
    type: 'MESSAGES_REQUESTED',
    payload: {
        messages
    }
});


export const messagesLoaded = (messages) => ({
    type: 'MESSAGES_LOADED',
    payload: {
        messages
    }
});