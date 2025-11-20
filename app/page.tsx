import { AgentWorkbench } from "@/components/AgentWorkbench";

export default function Page() {
  return (
    <main className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 flex justify-center blur-3xl">
        <div className="h-60 w-60 rounded-full bg-brand/30 mix-blend-screen sm:h-96 sm:w-96" />
      </div>
      <div className="relative z-10 px-6 md:px-12">
        <AgentWorkbench />
      </div>
    </main>
  );
}
