
import { ChannelType, MemberRole } from '@prisma/client'
import { ShieldCheck, ShieldAlert, Hash, Mic, Video } from 'lucide-react'


export const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck size={16} className="text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert size={16} className="text-rose-500" />,
}

export const channelIconMap = {
  [ChannelType.TEXT]: <Hash size={16} />,
  [ChannelType.AUDIO]: <Mic size={16} />,
  [ChannelType.VIDEO]: <Video size={16} />,
}