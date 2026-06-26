"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  MdFitnessCenter,
  MdVerifiedUser,
  MdPendingActions,
  MdCancel,
  MdCheckCircle,
  MdStar,
  MdArrowForward,
} from "react-icons/md";

const SPECIALTIES = [
  { value: "Yoga", icon: "🧘" },
  { value: "Cardio", icon: "🏃" },
  { value: "Strength", icon: "💪" },
  { value: "Pilates", icon: "🤸" },
  { value: "Zumba", icon: "💃" },
  { value: "CrossFit", icon: "🔥" },
  { value: "Boxing", icon: "🥊" },
  { value: "Swimming", icon: "🏊" },
];

export default function ApplyAsTrainer() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [existingApp, setExistingApp] = useState(null);
  const [checkingApp, setCheckingApp] = useState(true);

  const [form, setForm] = useState({
    experience: "",
    specialty: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if already applied
  useEffect(() => {
    const check = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`$\{process.env.NEXT_PUBLIC_API_URL\}/api/trainer-apply/${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          if (data.exists) setExistingApp(data);
        }
      } catch (_) {}
      finally { setCheckingApp(false); }
    };
    if (!isPending) check();
  }, [session, isPending]);

  const validate = () => {
    const e = {};
    if (!form.experience || isNaN(form.experience) || Number(form.experience) < 1)
      e.experience = "Please enter at least 1 year of experience.";
    if (!form.specialty)
      e.specialty = "Please select a specialty.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainer-apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
          experience: Number(form.experience),
          specialty: form.specialty,
          bio: form.bio,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setExistingApp({ exists: true, status: "Pending", specialty: form.specialty, experience: form.experience });
      } else {
        if (res.status === 409) {
          setExistingApp({ exists: true, status: data.status });
        } else {
          setErrors({ api: data.error || "Submission failed. Please try again." });
        }
      }
    } catch (_) {
      setErrors({ api: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isPending || checkingApp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Already Applied: show status card ────────────────────────────────────
  if (existingApp) {
    const isPending_ = existingApp.status === "Pending";
    const isRejected = existingApp.status === "Rejected";
    const isAccepted = existingApp.status === "Accepted";

    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
          {/* Top accent bar */}
          <div className={`h-1.5 w-full ${isPending_ ? "bg-gray-400" : isRejected ? "bg-red-600" : "bg-red-700"}`} />

          <div className="p-8">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${
              isPending_ ? "bg-gray-100 dark:bg-white/[0.05]"
              : isRejected ? "bg-red-50 dark:bg-red-900/20"
              : "bg-red-50 dark:bg-red-900/20"
            }`}>
              {isPending_  && <MdPendingActions className="text-3xl text-gray-500" />}
              {isRejected  && <MdCancel className="text-3xl text-red-600 dark:text-red-400" />}
              {isAccepted  && <MdCheckCircle className="text-3xl text-red-700 dark:text-rose-400" />}
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
              {isPending_  && "Application Under Review"}
              {isRejected  && "Application Rejected"}
              {isAccepted  && "Application Accepted!"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              {isPending_  && "Your trainer application is being reviewed by our admin team."}
              {isRejected  && "Unfortunately your application was not accepted this time."}
              {isAccepted  && "Congratulations! You are now an AuraGym trainer."}
            </p>

            {/* Status Badge */}
            <div className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold mb-4 ${
              isPending_ ? "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-300"
              : isRejected ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400"
              : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-700 dark:text-rose-400"
            }`}>
              {isPending_  && <><MdPendingActions size={18}/> Pending Review</>}
              {isRejected  && <><MdCancel size={18}/> Rejected</>}
              {isAccepted  && <><MdVerifiedUser size={18}/> Approved — Trainer</>}
            </div>

            {/* Application Details */}
            {(existingApp.specialty || existingApp.experience) && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {existingApp.specialty && (
                  <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1 font-medium">Specialty</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{existingApp.specialty}</p>
                  </div>
                )}
                {existingApp.experience && (
                  <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1 font-medium">Experience</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{existingApp.experience} yrs</p>
                  </div>
                )}
              </div>
            )}

            {/* Feedback on rejection */}
            {isRejected && existingApp.feedback && (
              <div className="mt-5 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1.5">Admin Feedback</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">{existingApp.feedback}</p>
              </div>
            )}

            {/* Re-apply section */}
            {isRejected && (
              <div className="mt-6">
                {existingApp.canReapply ? (
                  <button
                    onClick={() => {
                      setExistingApp(null);
                      setForm({ experience: "", specialty: "", bio: "" });
                    }}
                    className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold transition-all shadow-md"
                  >
                    Re-apply Now
                  </button>
                ) : (
                  <div className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-sm text-gray-600 dark:text-gray-400 font-semibold text-center">
                    You can re-apply in {existingApp.timeLeft} minutes
                  </div>
                )}
              </div>
            )}

            {/* Go to dashboard */}
            <button
              onClick={() => router.push("/dashboard/user")}
              className="w-full mt-6 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-10 shadow-sm">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdCheckCircle className="text-4xl text-red-700 dark:text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Your trainer application is now under review. We will notify you once a decision is made.
          </p>
          <div className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] text-sm font-bold text-gray-600 dark:text-gray-300 mb-6">
            <MdPendingActions size={18} /> Status: Pending Review
          </div>
          <button
            onClick={() => router.push("/dashboard/user")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm font-bold transition-all"
          >
            Go to Dashboard <MdArrowForward />
          </button>
        </div>
      </div>
    );
  }

  // ── Application Form ──────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdFitnessCenter className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">Trainer Program</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Apply as a Trainer</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Share your expertise and lead classes at AuraGym. Fill out the form below to get started.
        </p>
      </div>

      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl shadow-sm overflow-hidden">
        {/* Top red accent */}
        <div className="h-1 w-full bg-red-700 dark:bg-rose-600" />

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

          {/* API Error */}
          {errors.api && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl text-sm text-red-700 dark:text-red-400">
              <MdCancel size={18} className="flex-shrink-0" />
              {errors.api}
            </div>
          )}

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Years of Experience <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="50"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                placeholder="e.g. 3"
                className={`w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-white/[0.04] border text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all
                  ${errors.experience
                    ? "border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-300/30"
                    : "border-gray-200 dark:border-white/[0.08] focus:border-red-500 dark:focus:border-rose-500 focus:ring-2 focus:ring-red-200/30 dark:focus:ring-rose-500/10"
                  }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                yrs
              </span>
            </div>
            {errors.experience && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><MdCancel size={13}/>{errors.experience}</p>
            )}
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Specialty <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SPECIALTIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm({ ...form, specialty: s.value })}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all duration-150 
                    ${form.specialty === s.value
                      ? "bg-red-700 dark:bg-red-700 border-red-700 dark:border-rose-600 text-white shadow-md"
                      : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-rose-700/50 hover:text-red-700 dark:hover:text-rose-400"
                    }`}
                >
                  <span className="text-lg leading-none">{s.icon}</span>
                  {s.value}
                </button>
              ))}
            </div>
            {errors.specialty && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><MdCancel size={13}/>{errors.specialty}</p>
            )}
          </div>

          {/* Bio / About */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              About You <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about your fitness background, certifications, and why you want to be a trainer at AuraGym..."
              className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-red-500 dark:focus:border-rose-500 focus:ring-2 focus:ring-red-200/30 dark:focus:ring-rose-500/10 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/500</p>
          </div>

          {/* Applicant Info Row */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-700 dark:text-rose-400 font-bold text-base flex-shrink-0">
              {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session?.user?.email}</p>
            </div>
            <div className="ml-auto flex-shrink-0">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-white/[0.08] text-gray-600 dark:text-gray-300">
                <MdStar size={12} /> User
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-white/[0.05]" />

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold text-sm transition-all shadow-md shadow-red-700/20 hover:shadow-lg hover:shadow-red-700/30 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <MdVerifiedUser size={18} />
                Submit Application
                <MdArrowForward size={16} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            After submission your status will be set to <span className="font-semibold text-gray-600 dark:text-gray-300">Pending</span> until reviewed by admin.
          </p>
        </form>
      </div>
    </div>
  );
}
