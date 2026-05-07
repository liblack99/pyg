import type {LucideIcon} from "lucide-react";

type StageItem = {
  key: string;
  label: string;
  icon?: LucideIcon;
};

type Props = {
  stages: readonly StageItem[];
  currentStageKey: string;
};

export default function ProjectStageTimeline({stages, currentStageKey}: Props) {
  const stageIndex = stages.findIndex((stage) => stage.key === currentStageKey);

  return (
    <div className="flex w-full items-center justify-between px-6">
      {stages.map((stage, index) => {
        const done = index < stageIndex;
        const active = index === stageIndex;
        const Icon = stage.icon;

        return (
          <div key={stage.key} className="flex flex-1 items-center">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <div
                className={[
                  "flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  done || active
                    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "border-slate-300 bg-white text-slate-400",
                ].join(" ")}>
                {Icon ? (
                  <Icon className="size-4" />
                ) : (
                  <div className="size-2 rounded-full bg-current" />
                )}
              </div>

              <span
                className={[
                  "whitespace-nowrap text-xs font-medium transition-colors",
                  done || active ? "text-blue-600" : "text-slate-400",
                ].join(" ")}>
                {stage.label}
              </span>
            </div>

            {index < stages.length - 1 && (
              <div className="relative mx-3 h-0.5 flex-1">
                <div className="absolute inset-0 rounded-full bg-slate-200" />

                <div
                  className={[
                    "absolute inset-y-0 left-0 rounded-full bg-blue-600 transition-all duration-500",
                    done ? "w-full" : active ? "w-1/2" : "w-0",
                  ].join(" ")}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
