'use client';

import { useEffect, useState } from 'react';
import { SafetyCode } from '../lib/openai';

interface Segment {
    text: string;
    speaker: string;
    speaker_id: number;
    is_user: boolean;
    person_id: null | string;
    start: number;
    end: number;
    safety_code?: SafetyCode;
}

interface Conversation {
    segments: Segment[];
    session_id: string;
    fullText?: string;
}

const safetyCodeStyles = {
    'code green': 'bg-green-100 text-green-800 border border-green-300',
    'code yellow': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'code red': 'bg-red-100 text-red-800 border border-red-300',
    'code blue': 'bg-blue-100 text-blue-800 border border-blue-300'
};

const safetyCodeDescriptions = {
    'code green': 'Safe - No danger detected',
    'code yellow': 'Caution - Potential risk',
    'code red': 'Danger - Immediate threat',
    'code blue': 'Emergency - Life threatening'
};

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        const eventSource = new EventSource('/api/stream');

        eventSource.onmessage = (event) => {
            const newConversation = JSON.parse(event.data);
            setConversations(prev => {
                const existingConvIndex = prev.findIndex(
                    conv => conv.session_id === newConversation.session_id
                );

                if (existingConvIndex === -1) {
                    return [...prev, newConversation];
                }

                const updatedConversations = [...prev];
                const existingConv = updatedConversations[existingConvIndex];

                existingConv.segments = newConversation.segments;
                existingConv.fullText = newConversation.fullText;

                return updatedConversations;
            });
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Live Conversations</h1>

            {conversations.map((conversation, index) => {
                const safety_code = conversation.segments[0]?.safety_code;

                return (
                    <div key={`${conversation.session_id}-${index}`}
                        className="mb-8 p-4 border rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Session: {conversation.session_id}
                        </h2>

                        {safety_code && (
                            <div className={`mb-6 p-4 rounded-lg ${safetyCodeStyles[safety_code]}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Safety Classification</h3>
                                        <div className="text-sm font-medium">
                                            {safetyCodeDescriptions[safety_code]}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {safety_code.toUpperCase()}
                                    </div>
                                </div>

                                {conversation.fullText && (
                                    <div className="mt-4">
                                        <div className="font-medium mb-1">Classified Text:</div>
                                        <div className="bg-white bg-opacity-50 p-3 rounded">
                                            {conversation.fullText}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            {conversation.segments.map((segment) => (
                                <div key={`${segment.speaker}-${segment.start}`}
                                    className="p-4 bg-white rounded-lg shadow-sm">
                                    <div className="font-medium mb-2">
                                        {segment.speaker}
                                    </div>
                                    <div>
                                        {segment.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 