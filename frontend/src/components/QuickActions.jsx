import React from "react";
import { CheckCircle2, Lightbulb, ListChecks } from "lucide-react";

const quickActions = [
  {
    label: "Explícame paso a paso",
    icon: ListChecks,
  },
  {
    label: "Dame una pista",
    icon: Lightbulb,
  },
  {
    label: "Verifica mi razonamiento",
    icon: CheckCircle2,
  },
];

export function QuickActions({ onSelectAction }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {quickActions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            type="button"
            key={action.label}
            onClick={() => onSelectAction(`${action.label}: `)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-medium text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="rounded-xl bg-blue-100 p-2 text-blue-600">
              <Icon className="h-4 w-4" />
            </span>
            {action.label}
          </button>
        );
      })}
    </div>
  );
}