import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { messagesRequested } from '../../store/actions';
import Message from '../../components/message/Message';
import './MessageList.scss';
import { SocketContext } from '../../store/socket/context';

const MessageList = ({ conversationId, messages, loadMessages, userProfile }) => {
    useEffect(() => {
        loadMessages(conversationId);
    }, [conversationId]);

    let messageItems = null;
    if (messages && messages.length > 0 && userProfile) {
        messageItems = messages.map((message, index) => (
            <Message 
                key={index}
                isMyMessage={userProfile.id === message.fromUserId}
                message={message} 
            />
        ));
    }

    return (
        <div id="chat-message-list"> {messageItems} </div>
    );
}

const mapStateToProps = state => {
    return {
        messages: state.messagesState.messages,
    };
}

const mapDispatchToProps = dispatch => {
    const loadMessages = (conversationId) => {
        dispatch(messagesRequested(conversationId));
    }

    return { loadMessages };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageList);
