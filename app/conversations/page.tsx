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
    'code green': 'bg-green-100 text-green-800 border-l-4 border-green-500',
    'code yellow': 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500',
    'code red': 'bg-red-100 text-red-800 border-l-4 border-red-500',
    'code blue': 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
};

const safetyCodeIcons = {
    'code green': '✓',
    'code yellow': '⚠️',
    'code red': '🚨',
    'code blue': '🏥'
};

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [expandedSession, setExpandedSession] = useState<string | null>(null);

    useEffect(() => {
        const eventSource = new EventSource('/api/stream');

        eventSource.onmessage = (event) => {
            const newConversation = JSON.parse(event.data);

            setConversations((prevConversations) => {
                // Create a new reference for the array
                const updatedConversations = [...prevConversations];

                const existingConvIndex = updatedConversations.findIndex(
                    conv => conv.session_id === newConversation.session_id
                );

                if (existingConvIndex === -1) {
                    // If conversation doesn't exist, add it to the array
                    return [...updatedConversations, newConversation];
                }

                // Create a new reference for the existing conversation
                updatedConversations[existingConvIndex] = {
                    ...updatedConversations[existingConvIndex],
                    segments: [
                        ...updatedConversations[existingConvIndex].segments,
                        ...newConversation.segments
                    ],
                    fullText: newConversation.fullText
                };

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
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Safety Monitoring Dashboard</h1>

            <div className="space-y-2">
                {conversations.map((conversation) => {
                    const safety_code = conversation.segments[0]?.safety_code || 'code green';


                    return (
                        <div
                            key={conversation.session_id}
                            className={`${safetyCodeStyles[safety_code]} rounded-lg overflow-hidden`}
                        >
                            {/* Header - Always visible */}
                            <div
                                className="p-4 cursor-pointer hover:opacity-90 transition-opacity"

                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">

                                        <div>
                                            <div className="font-medium">
                                                Session: {conversation.session_id.slice(0, 8)}...
                                            </div>
                                            <div className="text-sm opacity-75">
                                                {conversation.segments.length} messages
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* Expanded Content */}

                            <div className="border-t bg-white bg-opacity-50 p-4">
                                <div className="space-y-3">
                                    {conversation.segments.map((segment, idx) => (
                                        <div
                                            key={`${segment.speaker}-${segment.start}-${idx}`}
                                            className="flex space-x-3"
                                        >
                                            <div>
                                                {segment.safety_code}
                                            </div>
                                            <div className="font-medium w-24 flex-shrink-0">
                                                {segment.speaker}:
                                            </div>
                                            <div className="flex-1">
                                                {segment.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
} 