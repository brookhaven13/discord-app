import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "members"
  | "invite"
  | "createServer"
  | "editServer"
  | "leaveServer"
  | "deleteServer"
  | "createChannel"
  | "editChannel"
  | "deleteChannel";

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));