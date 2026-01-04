import { type JSX } from "react";

export function Card({
  title,
  children,
  icon : Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon : React.ComponentType;
}): JSX.Element {
  return (
    <div className={`bg-cardBg rounded-lg px-4 py-6 pb-10 mx-10 w-fit drop-shadow-[0_3px_1px_rgba(0,0,0,0.2)] `}>
      <div>
        <div className="h-12 w-12 bg-iconBg p-2 rounded-lg text-textColor">
          {<Icon />}
        </div>
        <div className="font-semibold text-xl font-titillium mt-2">
          {title}
        </div>
      </div>
      <div className="max-w-65 mt-2 leading-6">
        {children}
      </div>
    </div>
  );
}
