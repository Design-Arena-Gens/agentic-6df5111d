'use client';

import { FormEvent, useMemo, useState } from "react";
import clsx from "clsx";
import { CommentSchema, GeneratedComment } from "@/lib/commentGenerator";
import { z } from "zod";
import { CommentCard } from "./CommentCard";

const defaultForm: CommentSchema = {
  videoTopic: "",
  creatorStyle: "",
  audience: "",
  hook: "",
  desiredOutcome: "",
  tone: "friendly",
  painPoints: [],
  includeQuestion: true,
  variations: 3
};

const suggestedPainPoints = [
  "keeping conversions high without sounding salesy",
  "turning swipe-bys into profile taps",
  "collecting niche recommendations quickly",
  "making comment sections feel personal",
  "guiding people to long-form resources"
];

const toneOptions: { value: CommentSchema["tone"]; label: string; caption: string }[] = [
  { value: "friendly", label: "Friendly hype", caption: "Warm, upbeat energy" },
  { value: "helpful", label: "Helpful guide", caption: "Practical + supportive" },
  { value: "bold", label: "Bold hook", caption: "Pattern break, spicy take" },
  { value: "insider", label: "Insider vibe", caption: "Creator-to-creator" },
  { value: "analytical", label: "Analytical", caption: "Data-backed confidence" },
  { value: "hype", label: "Hype train", caption: "High energy, viral push" }
];

export function AgentWorkbench() {
  const [form, setForm] = useState<CommentSchema>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<GeneratedComment[]>([]);

  const painPointText = useMemo(() => form.painPoints.join("\n"), [form.painPoints]);

  function syncPainPoints(value: string) {
    const next = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, painPoints: next }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    try {
      const payload = z
        .object({
          videoTopic: z.string().min(3, "Tell the agent what the video is about"),
          creatorStyle: z.string().optional(),
          audience: z.string().optional(),
          hook: z.string().optional(),
          desiredOutcome: z.string().optional(),
          tone: z.enum(toneOptions.map((option) => option.value) as [CommentSchema["tone"], ...CommentSchema["tone"][]]),
          painPoints: z.array(z.string()),
          includeQuestion: z.boolean(),
          variations: z.number().min(1).max(6)
        })
        .parse(form);

      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.details ?? "Unable to generate comments");
      }

      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issueMap: Record<string, string> = {};
        for (const issue of error.issues) {
          if (issue.path.length > 0) {
            issueMap[String(issue.path[0])] = issue.message;
          }
        }
        setErrors(issueMap);
      } else if (error instanceof Error) {
        setErrors({ root: error.message });
      } else {
        setErrors({ root: "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(defaultForm);
    setComments([]);
    setErrors({});
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl"
      >
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand/60">
            Campaign Blueprint
          </p>
          <h1 className="text-3xl font-semibold text-white">
            TikTok comment agent for benable
          </h1>
          <p className="text-sm text-slate-300">
            Feed the agent with video context so it can craft organic comments that hook creators
            and lurkers into checking benable.
          </p>
        </header>

        <div className="grid gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Video topic *
            </span>
            <input
              value={form.videoTopic}
              onChange={(event) => setForm((prev) => ({ ...prev, videoTopic: event.target.value }))}
              placeholder="e.g., Micro-influencer income streams breakdown"
              className={clsx(
                "rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50",
                errors.videoTopic && "border-red-500/60 focus:ring-red-500/40"
              )}
            />
            {errors.videoTopic ? (
              <span className="text-xs text-red-300">{errors.videoTopic}</span>
            ) : (
              <span className="text-xs text-slate-500">
                Mention the specific angle or question the creator is covering.
              </span>
            )}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Creator vibe
              </span>
              <input
                value={form.creatorStyle}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, creatorStyle: event.target.value }))
                }
                placeholder="e.g., chill Gen Z marketing coach"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50"
              />
              <span className="text-xs text-slate-500">
                Helps the agent mirror their tone while still sounding original.
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Audience they attract
              </span>
              <input
                value={form.audience}
                onChange={(event) => setForm((prev) => ({ ...prev, audience: event.target.value }))}
                placeholder="e.g., aspiring lifestyle creators"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50"
              />
              <span className="text-xs text-slate-500">
                Makes the comment feel like it understands their community.
              </span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Video hook line
              </span>
              <input
                value={form.hook}
                onChange={(event) => setForm((prev) => ({ ...prev, hook: event.target.value }))}
                placeholder='e.g., "3 systems making me passive income"'
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Desired outcome
              </span>
              <input
                value={form.desiredOutcome}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, desiredOutcome: event.target.value }))
                }
                placeholder="e.g., double profile taps, get collab leads"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Pain points to thread in
            </span>
            <textarea
              value={painPointText}
              onChange={(event) => syncPainPoints(event.target.value)}
              rows={4}
              placeholder={suggestedPainPoints.join("\n")}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50"
            />
            <span className="text-xs text-slate-500">
              One per line. These become micro-prompts the agent weaves into the benable comment.
            </span>
          </label>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Tone + format
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {toneOptions.map((option) => {
              const isActive = form.tone === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, tone: option.value }))}
                  className={clsx(
                    "rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
                    isActive
                      ? "border-brand bg-brand/30 text-white shadow-[0_0_35px_rgba(108,77,255,0.4)]"
                      : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-brand/40 hover:bg-brand/10"
                  )}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="text-xs text-slate-400">{option.caption}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.includeQuestion}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, includeQuestion: event.target.checked }))
                }
                className="h-5 w-5 rounded border border-white/10 bg-black/60 text-brand focus:ring-brand/40"
              />
              Include curiosity question about benable
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-200">
              <span>Variations</span>
              <input
                type="number"
                min={1}
                max={6}
                value={form.variations}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, variations: Number(event.target.value) }))
                }
                className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50"
              />
            </label>
          </div>
        </div>

        {errors.root && (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
            {errors.root}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-2xl border border-brand bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-brand-light hover:bg-brand-light disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-slate-400"
          >
            {loading ? "Generating..." : "Spin Up Comments"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-brand/40 hover:bg-brand/10 hover:text-white"
          >
            Reset
          </button>
        </div>
      </form>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <h2 className="text-lg font-semibold text-white">Comment drops</h2>
          <p className="mt-2 text-sm text-slate-300">
            Every line includes “benable”, mirrors the video vibe, and tees up your Benable profile
            without feeling spammy. Rotate through variations to keep TikTok happy.
          </p>
        </div>

        {comments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-black/30 p-8 text-center text-sm text-slate-400">
            Agent output lands here. Plug in a video scenario and generate up to six comment angles
            at once.
          </div>
        ) : (
          <div className="grid gap-5">
            {comments.map((comment, index) => (
              <CommentCard key={comment.id} comment={comment} index={index} />
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-brand/10 to-transparent p-6 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-white">Clever drops that win threads</h3>
          <ul className="mt-3 space-y-3 text-slate-300">
            <li>Reply once more with a follow-up pivot to keep the conversation warm.</li>
            <li>
              Screenshot or log the thread on your Benable profile so the account link stays synced.
            </li>
            <li>Rotate tone presets to dodge the TikTok spam filter while staying on-brand.</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
