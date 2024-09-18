"use client";

import React from 'react';
import { Member, Profile, Server } from '@prisma/client';
import { useParams, useRouter } from "next/navigation";
import { roleIconMap } from '@/lib/icon-maps';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const ServerMember = ({
  member,
  server,
}: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  return (
    <button
      className={cn(
        "group rounded-md flex items-center gap-x-2 w-full p-2 mb-1 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className="h-8 w-8" />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      <span>{icon}</span>
    </button>
  );
}

export default ServerMember;