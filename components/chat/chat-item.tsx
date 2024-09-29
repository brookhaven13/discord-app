"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { roleIconMap } from "@/lib/icon-maps";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  currentMember: Member;
  isUpdated: boolean;
  deleted: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  currentMember,
  isUpdated,
  deleted,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center p-4 w-full hover:bg-zinc-100/80 transition">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>

          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square border rounded-md flex items-center bg-secondary h-48 w-48 mt-2 overflow-hidden"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center gap-1 p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-8 w-8 fill-indigo-200 stroke-indigo-500" />
              <a
                href={fileUrl}
                target="_blankk"
                rel="noopener noreferrer"
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {canDelete && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute -top-2 right-5 p-1 bg-zinc-200 dark:bg-zinc-800 rounded-sm">
          {canEdit && (
            <ActionTooltip label="Edit">
              <Edit className="cursor-pointer text-zinc-500 dark:text-zinc-400 h-4 w-4 ml-auto " />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash className="cursor-pointer text-zinc-500 dark:text-zinc-400 h-4 w-4 ml-auto " />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
