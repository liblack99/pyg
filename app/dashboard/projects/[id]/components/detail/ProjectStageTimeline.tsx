type StageItem = {
  key: string;
  label: string;
};

type Props = {
  stages: readonly StageItem[];
  currentStageKey: string;
};

export default function ProjectStageTimeline({stages, currentStageKey}: Props) {
  const stageIndex = stages.findIndex((stage) => stage.key === currentStageKey);

  return (
    <div className="flex w-full  items-center justify-between">
      {stages.map((stage, index) => {
        const done = index < stageIndex;
        const active = index === stageIndex;

        return (
          <div key={stage.key} className="flex flex-1 items-center">
            <div className="group flex shrink-0 flex-col items-center gap-2">
              <div
                className={[
                  "h-4 w-4 rounded-full border-2 border-slate-300",
                  done || active ? "border-blue-500 bg-blue-500" : "",
                ].join(" ")}
              />

              <span
                className={[
                  "text-xs font-medium text-slate-400",
                  done || active ? "text-slate-900" : "",
                ].join(" ")}>
                {stage.label}
              </span>
            </div>

            {index < stages.length - 1 && (
              <div
                className={[
                  "h-0.5 flex-1 bg-slate-300",
                  index < stageIndex ? "bg-blue-500" : "",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
