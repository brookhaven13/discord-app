import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="border-neutral-200 dark:border-neutral-800 border-b-2 text-md font-semibold flex items-center h-12 px-3">
      <MobileToggle serverId={serverId} />

      {type === "channel" && (
        <Hash size={20} className="text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-6 w-6 md:h-6 md:w-6 mr-2" />
      )}
      <span className="font-semibold text-md text-black dark:text-white">
        {name}
      </span>

      <div className="flex items-center ml-auto">
        {type === "conversation" && (
          <ChatVideoButton />
        )}
        <SocketIndicator />
      </div>
    </div>
  );
};
