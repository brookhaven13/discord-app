"use client";

import React from "react";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Lock, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { channelIconMap } from "@/lib/icon-maps";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const icon = channelIconMap[channel.type];

  return (
    <div
      className={cn(
        "group cursor-pointer rounded-md flex items-center gap-x-2 w-full p-2 mb-1 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <span className="flex-shrink-0 text-zinc-500 dark:text-zinc-400 h-5 w-5">
        {icon}
      </span>

      <p
        className={cn(
          "line-clamp-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>

      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="Edit">
            <Edit className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteChannel", { channel, server })}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <Lock className="text-zinc-500 dark:text-zinc-400 w-4 h-4 ml-auto" />
      )}
    </div>
  );
};

export default ServerChannel;
