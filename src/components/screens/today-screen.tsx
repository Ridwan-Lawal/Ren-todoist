"use client";

import { focusQuickCapture, QuickCapture } from "@/components/capture/quick-capture";
import { DataGate } from "@/components/layout/data-gate";
import { TaskItem, TaskList } from "@/components/task/task-item";
import { Button } from "@/components/ui/button";
import { EmptyState, GroupLabel, PageHeader, SectionHeading } from "@/components/ui/states";
import type { Task } from "@/lib/tasks/task-types";
import { getCompletedToday, getTodayView, getUpcoming } from "@/lib/tasks/task-views";
import { formatDateLabel, fromDateKey } from "@/lib/utils/dates";

export function TodayScreen() {
  return (
    <DataGate>
      {({ tasks, projects, today }) => {
        const { overdue, dueToday, undated } = getTodayView(tasks, today);
        const completed = getCompletedToday(tasks, today);
        const upcoming = getUpcoming(tasks, today);
        const itemProps = { today, projects };
        const groups: { id: string; label: string; tasks: Task[]; tone?: "danger" }[] = [
          { id: "group-overdue", label: "Overdue", tasks: overdue, tone: "danger" as const },
          { id: "group-today", label: "Today", tasks: dueToday },
          { id: "group-undated", label: "No date", tasks: undated },
        ].filter((group) => group.tasks.length > 0);

        return (
          <>
            <PageHeader
              title="Today"
              meta={fromDateKey(today).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            />

            <QuickCapture today={today} projects={projects} />

            <section aria-label="Today's tasks" className="mb-12">
              {groups.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {groups.map((group) => (
                    <div key={group.id}>
                      <GroupLabel id={group.id} tone={group.tone}>
                        {group.label}
                      </GroupLabel>
                      <TaskList labelledBy={group.id}>
                        {group.tasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            {...itemProps}
                            hideDate={group.id === "group-today"}
                            hideOverdueLabel={group.id === "group-overdue"}
                          />
                        ))}
                      </TaskList>
                    </div>
                  ))}
                </div>
              ) : completed.length > 0 ? (
                <EmptyState title="You're all caught up." description="Nothing else needs your attention today." />
              ) : (
                <EmptyState
                  title="You're all caught up."
                  description="Nothing needs your attention right now."
                  hint={
                    <>
                      Try <kbd className="rounded-sm bg-subtle px-1.5 py-0.5 font-sans text-foreground/80">Call Sam tomorrow at 3pm #work</kbd>
                    </>
                  }
                  action={<Button onClick={focusQuickCapture}>Capture a task</Button>}
                />
              )}
            </section>

            {completed.length > 0 && (
              <section className="mb-12 border-t border-border pt-6">
                <details className="group/completed">
                  <summary className="-mx-2 flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-2 text-muted transition-colors duration-150 hover:text-foreground [&::-webkit-details-marker]:hidden">
                    <span
                      aria-hidden
                      className="inline-block w-3 text-center transition-transform duration-150 group-open/completed:rotate-90"
                    >
                      ›
                    </span>
                    <span className="text-sm font-medium">Completed today</span>
                    <span className="text-meta tabular-nums">{completed.length}</span>
                  </summary>
                  <div className="mt-1">
                    <TaskList>
                      {completed.map((task) => (
                        <TaskItem key={task.id} task={task} {...itemProps} />
                      ))}
                    </TaskList>
                  </div>
                </details>
              </section>
            )}

            {upcoming.length > 0 && (
              <section aria-labelledby="upcoming" className="border-t border-border pt-6">
                <SectionHeading id="upcoming">Upcoming</SectionHeading>
                <div className="mt-4 flex flex-col gap-5">
                  {upcoming.map((day) => {
                    const label = formatDateLabel(day.date, today);
                    const headingId = `upcoming-${day.date}`;
                    return (
                      <div key={day.date} className="md:grid md:grid-cols-[7.5rem_1fr] md:gap-4">
                        <h3 id={headingId} className="pt-0 text-sm font-medium md:pt-3">
                          {label}
                          <span className="ml-2 text-meta font-normal text-muted md:ml-0 md:block">
                            {fromDateKey(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </h3>
                        <TaskList labelledBy={headingId}>
                          {day.tasks.map((task) => (
                            <TaskItem key={task.id} task={task} {...itemProps} hideDate />
                          ))}
                        </TaskList>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        );
      }}
    </DataGate>
  );
}
