"use client";

import { focusQuickCapture, QuickCapture } from "@/components/capture/quick-capture";
import { DataGate } from "@/components/layout/data-gate";
import { TaskItem, TaskList } from "@/components/task/task-item";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, SectionHeading } from "@/components/ui/states";
import { getCompletedToday, getTodayView, getUpcoming } from "@/lib/tasks/task-views";
import { formatDateLabel, fromDateKey } from "@/lib/utils/dates";

export function TodayScreen() {
  return (
    <DataGate>
      {({ tasks, projects, today }) => {
        const { overdue, dueToday, undated } = getTodayView(tasks, today);
        const todayTasks = [...overdue, ...dueToday, ...undated];
        const completed = getCompletedToday(tasks, today);
        const upcoming = getUpcoming(tasks, today);
        const itemProps = { today, projects };

        return (
          <>
            <PageHeader
              title="Today"
              subtitle={fromDateKey(today).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            />

            <QuickCapture today={today} projects={projects} />

            <section aria-labelledby="today-tasks" className="mb-10">
              <h2 id="today-tasks" className="sr-only">
                Today&apos;s tasks
              </h2>
              {todayTasks.length > 0 ? (
                <TaskList>
                  {todayTasks.map((task) => (
                    <TaskItem key={task.id} task={task} {...itemProps} />
                  ))}
                </TaskList>
              ) : completed.length > 0 ? (
                <EmptyState title="You're all caught up." description="Nothing else needs your attention today." />
              ) : (
                <EmptyState
                  title="You're all caught up."
                  description="Nothing needs your attention right now."
                  action={<Button onClick={focusQuickCapture}>Capture a task</Button>}
                />
              )}
            </section>

            {completed.length > 0 && (
              <section className="mb-10">
                <details className="group/completed">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    <span
                      aria-hidden
                      className="inline-block text-sm text-muted transition-transform duration-150 group-open/completed:rotate-90"
                    >
                      ›
                    </span>
                    Completed
                    <span className="text-sm font-normal text-muted">{completed.length}</span>
                  </summary>
                  <TaskList>
                    {completed.map((task) => (
                      <TaskItem key={task.id} task={task} {...itemProps} />
                    ))}
                  </TaskList>
                </details>
              </section>
            )}

            {upcoming.length > 0 && (
              <section aria-labelledby="upcoming">
                <SectionHeading>
                  <span id="upcoming">Upcoming</span>
                </SectionHeading>
                {upcoming.map((day) => (
                  <div key={day.date} className="mt-4">
                    <h3 className="text-sm font-medium text-muted">
                      {formatDateLabel(day.date, today)} · {day.tasks.length} {day.tasks.length === 1 ? "task" : "tasks"}
                    </h3>
                    <TaskList>
                      {day.tasks.map((task) => (
                        <TaskItem key={task.id} task={task} {...itemProps} hideDate />
                      ))}
                    </TaskList>
                  </div>
                ))}
              </section>
            )}
          </>
        );
      }}
    </DataGate>
  );
}
