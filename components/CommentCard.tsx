'use client';

import { useState } from "react";
import { GeneratedComment } from "@/lib/commentGenerator";

type Props = {
  comment: GeneratedComment;
  index: number;
};

export function CommentCard({ comment, index }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy", error);
    }
  }

  return (
    <article className="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg transition hover:-translate-y-1 hover:border-brand/60 hover:bg-brand/10">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-lg font-semibold text-brand">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-brand/80">
              {comment.angle}
            </p>
            <p className="text-xs text-slate-400">Includes benable + question hook</p>
          </div>
        </div>
        <button
          onClick={() => handleCopy(comment.text)}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-brand hover:bg-brand/30"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </header>

      <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-100">
        {comment.text}
      </p>

      <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-sm text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Follow-up pivots
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          {comment.followUps.map((line, idx) => (
            <li key={idx} className="leading-relaxed">
              {line}
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleCopy(comment.followUps.join("\n"))}
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-brand hover:bg-brand/30"
        >
          {copied ? "Copied!" : "Copy Follow-ups"}
        </button>
      </div>
    </article>
  );
}
