import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";
import { useSocket } from "@/components/provider/socket-provider";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWIthProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWIthProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.legnth === 0) return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWIthProfile) => {
              if (item.id === message.id) {
                return message;
              }

              return item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };

      });
    });

    socket.on(addKey, (message: MessageWithMemberWIthProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{
              items: [message],
            }]
          }
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        }

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    }
  }, [addKey, queryClient, queryKey, socket, updateKey]);
};
