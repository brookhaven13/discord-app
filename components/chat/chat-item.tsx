"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { Member, MemberRole, Profile } from "@prisma/client";
import { cn } from "@/lib/utils";
import { roleIconMap } from "@/lib/icon-maps";
import { useModal } from "@/hooks/use-modal-store";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

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

const formSchema = z.object({
  content: z.string().min(1),
});

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
  const { onOpen } = useModal();

  const router = useRouter();
  const params = useParams();

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log("onSubmit");
      try {
        const url = qs.stringifyUrl({
          url: `${socketUrl}/${id}`,
          query: socketQuery,
        });

        await axios.patch(url, values);

        form.reset();
        setIsEditing(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, id, socketQuery, socketUrl]
  );

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    form.reset({ content });
  }, [content, form]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsEditing]);

  useEffect(() => {
    const handleSave = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        e.target instanceof HTMLTextAreaElement &&
        e.target.id === "chat-item-textarea"
      ) {
        e.preventDefault();
        setIsSubmitting(true);
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [form, onSubmit]);

  return (
    <div className="relative group flex items-center p-4 w-full hover:bg-zinc-600/5 dark:hover:bg-black/5 transition">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={() => onMemberClick()}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-1">
              <p className="cursor-pointer font-semibold text-sm hover:underline">
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
                "text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap break-words",
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

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center gap-x-2 w-full pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Textarea
                            id="chat-item-textarea"
                            className="resize-none border-none border-0 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200 p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Edited message"
                            {...field}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] text-zinc-400 mt-1">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDelete && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute -top-2 right-5 p-1 bg-zinc-200 dark:bg-zinc-800 rounded-sm">
          {canEdit && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer text-zinc-500 dark:text-zinc-400 h-4 w-4 ml-auto "
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer text-zinc-500 dark:text-zinc-400 h-4 w-4 ml-auto "
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
