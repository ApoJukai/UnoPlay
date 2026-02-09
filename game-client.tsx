import React from 'react';
import GameBoard from './GameBoard';

const GameClient = () => {
    // ... other functions and state

    const handleSendEmoji = async (emoji) => {
        try {
            const response = await fetch('/api/chat/send-emoji', {
                method: 'POST',
                body: JSON.stringify({ emoji }),
                headers: { 'Content-Type': 'application/json' },
            });
            // handle response
        } catch (error) {
            console.error('Error sending emoji:', error);
        }
    };

    const handleSendQuickChat = async (message) => {
        try {
            const response = await fetch('/api/chat/send', {
                method: 'POST',
                body: JSON.stringify({ message }),
                headers: { 'Content-Type': 'application/json' },
            });
            // handle response
        } catch (error) {
            console.error('Error sending quick chat message:', error);
        }
    };

    return (
        <GameBoard
            onSendEmoji={handleSendEmoji}
            onSendQuickChat={handleSendQuickChat}
            // ... other props
        />
    );
};

export default GameClient;