"use client";

import { Header } from "@/components/Header";
import { CheckCircle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { SafetyCode } from "../lib/openai";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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
  "code green": "bg-green-100 text-green-800 border-l-4 border-green-500",
  "code yellow": "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
  "code red": "bg-red-100 text-red-800 border-l-4 border-red-500",
  "code blue": "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isFundsTransferring, setIsFundsTransferring] = useState(false);
  const [isFundsTransferred, setIsFundsTransferred] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const [isAlerted, setIsAlerted] = useState(false);
  console.log({ conversations });

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (event) => {
      const newConversation = JSON.parse(event.data);

      setConversations((prevConversations) => {
        // Create a new reference for the array
        const updatedConversations = [...prevConversations];

        const existingConvIndex = updatedConversations.findIndex(
          (conv) => conv.session_id === newConversation.session_id
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
            ...newConversation.segments,
          ],
          fullText: newConversation.fullText,
        };

        return updatedConversations;
      });
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    // Check if any conversation has code red
    const hasCodeRed = conversations.some((conv) =>
      conv.segments.some((segment) => segment.safety_code === "code red")
    );

    if (hasCodeRed) {
      // Start the alert sequence
      setIsAlerting(true);
      setTimeout(() => {
        setIsAlerting(false);
        setIsAlerted(true);
      }, 1000);

      // Start the funds transfer sequence
      setIsFundsTransferring(true);
      setTimeout(() => {
        setIsFundsTransferring(false);
        setIsFundsTransferred(true);
      }, 5000);
    }
  }, [conversations]);

  return (
    <div>
      <Header />
      <section className="container p-10 flex flex-col items-center gap-6 sm:gap-7">
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-center">
            Dead Ass Saftey Center
          </h2>
        </div>
        <div className="mt-6 grid auto-rows-fr gap-7 aspect-auto md:grid-cols-2 grid-cols-1">
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardContent className="flex h-full flex-col items-start gap-5 px-0 rounded-lg border-2 p-10 sm:grid-cols-2">
              <h4 className="font-semibold text-xl">Your Saftey Status</h4>
              <div className="space-y-2">
                {conversations.map((conversation) => {
                  const safety_code =
                    conversation.segments[conversation.segments.length - 1]
                      ?.safety_code || "code green";

                  return (
                    <div
                      key={conversation.session_id}
                      className={`${safetyCodeStyles[safety_code]} rounded-lg overflow-hidden`}
                    >
                      <div className="border-t bg-white bg-opacity-50 p-4">
                        <div className="text-xl font-bold">
                          {safety_code}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-1 flex-col gap-4 max-w-full">
                <div className="flex items-center gap-2">
                  {isFundsTransferred ? (
                    <>
                      <CheckCircle className="text-green-500" size={20} />
                      <p className="text-muted-foreground max-w-full">
                        Funds Transferred
                      </p>
                    </>
                  ) : isFundsTransferring ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <p className="text-muted-foreground max-w-full">
                        Funds are being transferred to your emergency
                        contacts...
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <p className="text-muted-foreground max-w-full">
                        Funds Protected
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isAlerted ? (
                    <>
                      <CheckCircle className="text-green-500" size={20} />
                      <p className="text-muted-foreground max-w-full">
                        Friends and Family Alerted
                      </p>
                    </>
                  ) : isAlerting ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <p className="text-muted-foreground max-w-full">
                        Alerting Friends and Family...
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <p className="text-muted-foreground max-w-full">
                        Alert System Ready
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2" />
              </div>
            </CardContent>
          </Card>
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardContent className="flex h-full flex-col items-start gap-5 px-0 border-2 rounded-lg p-10 sm:grid-cols-12">
              <h4 className="font-semibold text-xl">
                Your Safety Transcript 🔊
              </h4>
              <p className="mb-auto text-muted-foreground">
                This is a real-time recording of voices in your current
                surroundings. Based on this, we assess if you are in danger.{" "}
              </p>
              {conversations.map((conversation) => {
                const safety_code =
                  conversation.segments[0]?.safety_code || "code green";

                return (
                  <div
                    key={conversation.session_id}
                    className={`${safetyCodeStyles[safety_code]} rounded-lg overflow-hidden w-full`}
                  >
                    <div className="border-t bg-white bg-opacity-50 p-4">
                      <div className="space-y-3">
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            {conversation.fullText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 grid auto-rows-fr gap-7 aspect-auto md:grid-cols-2 grid-cols-1">
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardContent className="flex h-full flex-col items-start gap-5 px-0 border-2 rounded-lg p-10 sm:grid-cols-12">
              <h4 className="font-semibold text-xl">Your Emergency Contacts</h4>
              <div className="relative w-full flex items-center justify-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    alt="avatar"
                    src="/images/profile-1.png"
                    className="object-cover"
                  />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    alt="avatar"
                    src="/images/profile-4.png"
                    className="object-cover"
                  />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    alt="avatar"
                    src="/images/profile-2.png"
                    className="object-cover"
                  />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    alt="avatar"
                    src="/images/profile-3.png"
                    className="object-cover"
                  />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <p className="mb-auto text-muted-foreground">
                  Your emergency contacts will be alerted if you are in a
                  situation with a danger level of Code Red or Code Blue.{" "}
                </p>
                <div className="flex items-center gap-3" />
              </div>
            </CardContent>
          </Card>
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardContent className="flex h-full flex-col items-start gap-5 px-0 rounded-lg border-2 p-10 sm:grid-cols-2">
              <h4 className="font-semibold text-xl">Your Protected Wallets</h4>
              <p className="mb-auto text-muted-foreground">
                All funds in your protected wallets will be sent to your
                emergency contacts in the event of a Code Red or Code Blue
                event.{" "}
              </p>
              <div className="flex flex-1 flex-col gap-4 max-w-full">
                <p className="text-muted-foreground max-w-full">
                  0x425................................eFfC421
                </p>
                <p className="text-muted-foreground max-w-full">
                  0x09F................................F47srvF5
                </p>
                <p className="text-muted-foreground max-w-full">
                  0xg0p...............................jm83mFe
                </p>
                <p className="text-muted-foreground max-w-full">
                  0xM03................................9ikm4fd
                </p>
                <div className="flex items-center gap-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
