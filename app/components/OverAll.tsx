import { CheckCircle, Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function OverAll() {
  return (
    <section className="container p-10 flex flex-col items-center gap-6 sm:gap-7">
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-center">
          Dead Ass Saftey Center
        </h2>
      </div>
      <div className="mt-6 grid auto-rows-fr gap-7 aspect-auto md:grid-cols-2 grid-cols-1">
        <Card className="h-full border-0 shadow-none bg-transparent">
          <CardContent className="flex h-full flex-col items-start gap-5 px-0 rounded-lg border-2 p-10 sm:grid-cols-2">
            <h4 className="font-semibold text-gray-300 text-gray-400">
              Current Status
            </h4>
            <h4 className="font-semibold text-xl">🔴 Code Red: Danger</h4>
            <div className="flex flex-1 flex-col gap-4 max-w-full">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <p className="text-muted-foreground max-w-full underline">
                  Funds Sent to Emergency Contacts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Loader size={20} />
                <p className="text-muted-foreground max-w-full">
                  Alert Sent to Emergency Contacts
                </p>
              </div>
              <div className="flex items-center gap-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="h-full border-0 shadow-none bg-transparent">
          <CardContent className="flex h-full flex-col items-start gap-5 px-0 border-2 rounded-lg p-10 sm:grid-cols-12">
            <h4 className="font-semibold text-xl">Your Safety Transcript 🔊</h4>
            <p className="mb-auto text-muted-foreground max-w-full italic font-extralight">
              Alright, listen up. I don’t want to hurt you, but I will if I have
              to. Empty your pockets—cash, phone, whatever you’ve got—now. Don’t
              try anything stupid, and this will be over in seconds.
            </p>
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
                  src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/avatar_e366390b-69e8-4a2b-955f-b483aacb5859.jpeg"
                  className="object-cover"
                />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16">
                <AvatarImage
                  alt="avatar"
                  src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/avatar_6354a7f0-f6c9-4963-8e58-3807a0214c92.jpeg"
                  className="object-cover"
                />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16">
                <AvatarImage
                  alt="avatar"
                  src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/avatar_e4c665f8-1dc1-4f3d-a99d-db7fb747d297.jpeg"
                  className="object-cover"
                />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16">
                <AvatarImage
                  alt="avatar"
                  src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/avatar_d87006cb-bbda-4c85-89c8-1077290a1c48.jpeg"
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
              All funds in your protected wallets will be sent to your emergency
              contacts in the event of a Code Red or Code Blue event.{" "}
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
  );
}
