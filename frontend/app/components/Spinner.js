import { Loader2Icon } from "lucide-react";
export default function Spinner() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <Loader2Icon className="animate-spin text-rose-200" />
    </div>
  );
}
