import {Loader2} from "lucide-react";

type PageLoaderProps = {
  message?: string;
  compact?: boolean;
  loading?: boolean;
};

export function PageLoader({
                             message = "Lade Inhalte...",
                             compact = false,
                             loading = true
                           }: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center  ${
        compact ? "py-4" : "min-h-screen"
      } `}
    >
      {loading && (
        <Loader2 className="w-10 h-10 animate-spin text-primary"/>
      )}
      <p className="text-2xl font-semibold">{message}</p>
    </div>
  );
}
