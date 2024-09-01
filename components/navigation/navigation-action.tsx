"use client";

import { Plus } from "lucide-react";

export const NavigationAction = () => {
  return (
    <div>
      <button
        className="group"
      >
        <div className="flex items-center justify-center mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
          <Plus className="group-hover:text-white transition text-emerald-500" size={25} />
        </div>
      </button>
    </div>
  );
};
