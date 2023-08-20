import React from 'react';
import classNames from 'classnames';
import './Message.scss';

const Message = ({ isMyMessage, message }) => {
    const messageClass = classNames('message-row', {
        'you-message': isMyMessage,
        'other-message': !isMyMessage
    });
    
    const imageThumbnail = isMyMessage 
        ? null 
        : <img src={"https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} />;

    return (
        <div className={messageClass}>
            <div className="message-content">
                {imageThumbnail}
                <div className="message-text">
                    {message.content}
                </div>
                <div className="message-time">{message.createdAt}</div>
            </div>
        </div>
    );
}

export default Message;