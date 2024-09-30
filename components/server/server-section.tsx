"use client";

import React from "react";
import { Plus, Settings } from "lucide-react";
import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  const handleCreateChannel = () => {
    onOpen("createChannel", { channelType });
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</div>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top" >
          <div 
            onClick={handleCreateChannel}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </div>
        </ActionTooltip>
      )}


      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top" >
          <div 
            onClick={() => onOpen("members" , { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </div>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;