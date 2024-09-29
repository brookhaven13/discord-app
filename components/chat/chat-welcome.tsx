import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
}

export const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center h-[75px] w-[75px]">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}

      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? `Welcome to #${name}` : `${name}`}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}.`
        }
      </p>
    </div>
  );
};
