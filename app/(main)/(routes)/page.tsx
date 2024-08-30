import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center gap-2">
      <UserButton />
      <ModeToggle />
    </div>
  );
}
