"use client";

import React from 'react';
import { Member, Profile, Server } from '@prisma/client';
import { useParams, useRouter } from "next/navigation";
import { roleIconMap } from '@/lib/icon-maps';

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

  const Icon = roleIconMap[member.role];

  return (
    <div>ServerMember</div>
  )
}

export default ServerMember;