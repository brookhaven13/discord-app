import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";


interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="border-neutral-200 dark:border-neutral-800 border-b-2 text-md font-semibold flex items-center h-12 px-3">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash size={20} className="text-zinc-500 dark:text-zinc-400" />
      )}
      <span className="font-semibold text-md text-black dark:text-white">
        {name}
      </span>
    </div>
  );
};

export default ChatHeader;
