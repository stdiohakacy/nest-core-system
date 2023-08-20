import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { conversationChanged, newMessageAdded, conversationDeleted, conversationsRequested } from '../../store/actions';
import ConversationSearch from '../../components/conversation/conversation-search/ConversationSearch';
import NoConversations from '../../components/conversation/no-conversations/NoConversations';
import ConversationList from '../../components/conversation/conversation-list/ConversationList';
import NewConversation from '../../components/conversation/new-conversation/NewConversation';
import ChatTitle from '../../components/chat-title/ChatTitle';
import MessageList from '../message/MessageList';
import ChatForm from '../../components/chat-form/ChatForm';

import './ChatShell.scss';
import { SOCKET_CHANNEL_NAME } from '../../store/socket/constant';
import { SocketContext } from '../../store/socket/context';

const ChatShell = ({
    userProfile,
    conversations, 
    selectedConversation, 
    conversationChanged,
    onMessageSubmitted,
    onDeleteConversation,
    loadConversations,
}) => {
    const socket = useContext(SocketContext);
    socket.on('connect', () => {
      console.log(socket.id + " connected")
    });
    socket.on("disconnect", () => {
      console.log(socket.id + " disconnected");
    });
    useEffect(() => {
        socket.on(SOCKET_CHANNEL_NAME.CREATED_MESSAGE, (message) => {
            onMessageSubmitted(message)
        })
        loadConversations();
        
    }, [loadConversations]);
    
    let conversationContent = (
        <>
            <NoConversations></NoConversations>
        </>
    );

    if (conversations.length > 0) {
        conversationContent = (
            <>
                <MessageList conversationId={selectedConversation.id} userProfile={userProfile} />
            </>
        );
    }

    return (
        <div id="chat-container">
            <ConversationSearch conversations={conversations} />
            <ConversationList
                onConversationItemSelected={conversationChanged}
                conversations={conversations}
                selectedConversation={selectedConversation} 
            />
            <NewConversation />
            <ChatTitle 
                selectedConversation={selectedConversation}
                onDeleteConversation={onDeleteConversation} />
            {conversationContent}
            <ChatForm 
                selectedConversation={selectedConversation}
                userProfile={userProfile}
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        conversations: state.conversationState.conversations,
        selectedConversation: state.conversationState.selectedConversation
    };
};
  
const mapDispatchToProps = dispatch => ({
    conversationChanged: conversationId => dispatch(conversationChanged(conversationId)),
    onMessageSubmitted: message => { dispatch(newMessageAdded(message)); },
    onDeleteConversation: () => { dispatch(conversationDeleted()); },
    loadConversations: () => { dispatch(conversationsRequested())}
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatShell);