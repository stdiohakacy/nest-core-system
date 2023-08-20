import React, { useContext, useEffect, useState } from 'react';
import FormButton from '../controls/buttons/FormButton';
import AttachmentIcon from '../controls/icons/attachment-icon/AttachmentIcon';
import './ChatForm.scss';
import { v4 as uuidv4 } from 'uuid'
import { SOCKET_CHANNEL_NAME } from '../../store/socket/constant';
import { SocketContext } from '../../store/socket/context';

const isMessageEmpty = (textMessage) => {
    return adjustTextMessage(textMessage).length === 0;
}

const adjustTextMessage = (textMessage) => {
    return textMessage.trim();
};

const ChatForm = ({ selectedConversation, onMessageSubmitted, userProfile }) => {
    const socket = useContext(SocketContext)
    const [textMessage, setTextMessage] = useState('');
    const disableButton = isMessageEmpty(textMessage);
    let formContents = null;
    let handleFormSubmit = null;

    if (selectedConversation) {
        formContents = (
            <>
                <div title="Add Attachment">
                    <AttachmentIcon />
                </div>
                <input 
                    type="text" 
                    placeholder="type a message" 
                    value={textMessage}
                    onChange={ (e) => { setTextMessage(e.target.value); } } />
                <FormButton disabled={ disableButton }>Send</FormButton>
            </>
        );
    
        handleFormSubmit = (e) => {
            e.preventDefault();
            
            if (!isMessageEmpty(textMessage)) {
                socket.emit(SOCKET_CHANNEL_NAME.CREATE_MESSAGE, {
                    id: uuidv4(),
                    fromUserId: userProfile.id,
                    conversationId: selectedConversation,
                    content: textMessage,
                    createdAt: new Date()
                })
                setTextMessage('');
            }
        };
    }

    return (
        <form id="chat-form" onSubmit={handleFormSubmit}>
            {formContents}
        </form> 
    );
}

export default ChatForm;