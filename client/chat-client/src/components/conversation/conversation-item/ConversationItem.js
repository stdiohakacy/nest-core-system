import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import './ConversationItem.scss';
import { connect } from 'react-redux';
import { messageCreated } from '../../../store/actions';
import { SocketContext } from '../../../store/socket/context';

const ConversationItem = ({ conversation, isActive, onConversationItemSelected, onMessageCreated }) => {
    const socket = useContext(SocketContext)
    console.log(socket)
    useEffect(() => {
        socket.emit("join-conversation", conversation.conversationId)
    });

    const className = classNames('conversation', {
        'active': isActive
    });

    return (
        <div className={className} onClick={() => onConversationItemSelected(conversation.id)}>
            <img src="https://as2.ftcdn.net/v2/jpg/05/49/98/39/1000_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg" alt="" />
            <div className="title-text">{conversation.name}</div>
            <div className="created-date">{conversation.lastTime}</div>
            <div className="conversation-message">
                {conversation.lastMessage}
            </div>
        </div>
    );
}

export default ConversationItem