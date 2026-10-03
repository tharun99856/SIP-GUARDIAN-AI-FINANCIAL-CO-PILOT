'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SIPAction, PauseReason } from '@/types';
import { SIP_PRESETS, REASON_LABELS } from '@/lib/presets';
import CheckpointIntervention from '@/components/CheckpointIntervention';

export default function CheckpointPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>(SIP_PRESETS[0].id);
  const [monthlyAmount, setMonthlyAmount] = useState(SIP_PRESETS[0].monthlyAmount);
  const [currentValue, setCurrentValue] = useState(SIP_PRESETS[0].currentValue);
  const [goalAmount, setGoalAmount] = useState(SIP_PRESETS[0].goalAmount);
  const [yearsToGoal, setYearsToGoal] = useState(SIP_PRESETS[0].yearsToGoal);
  const [fundName, setFundName] = useState(SIP_PRESETS[0].fundName);
  const [action, setAction] = useState<SIPAction | null>(null);
  const [reason, setReason] = useState<PauseReason | null>(null);
  const [showIntervention, setShowIntervention] = useState(false);

  const handlePresetChange = (presetId: string) => {
    const preset = SIP_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setMonthlyAmount(preset.monthlyAmount);
      setCurrentValue(preset.currentValue);
      setGoalAmount(preset.goalAmount);
      setYearsToGoal(preset.yearsToGoal);
      setFundName(preset.fundName);
      setAction(null);
      setReason(null);
    }
  };

  if (showIntervention && action && reason) {
    return (
      <CheckpointIntervention
        monthlyAmount={monthlyAmount}
        currentValue={currentValue}
        goalAmount={goalAmount}
        yearsToGoal={yearsToGoal}
        fundName={fundName}
        action={action}
        reason={reason}
        onBack={() => setShowIntervention(false)}
      />
    );
  }

  const ACTIONS: { id: SIPAction; label: string; sub: string; color: string; bgSel: string; borderSel: string }[] = [
    {
      id: 'cancel',
      label: 'Cancel SIP',
      sub: 'Permanently stops all monthly contributions.',
      color: '#FB7185',
      bgSel: 'rgba(244,63,94,0.09)',
      borderSel: '#F43F5E',
    },
    {
      id: 'pause',
      label: 'Pause for 6 Months',
      sub: 'Temporarily pauses SIP, resuming automatically later.',
      color: '#FBBF24',
      bgSel: 'rgba(245,158,11,0.09)',
      borderSel: '#F59E0B',
    },
    {
      id: 'reduce',
      label: 'Reduce SIP to 50%',
      sub: `Cuts installment to ₹${Math.floor(monthlyAmount / 2).toLocaleString('en-IN')}/mo.`,
      color: '#38BDF8',
      bgSel: 'rgba(56,189,248,0.09)',
      borderSel: '#38BDF8',
    },
  ];

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#060B18]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="page-container h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-85 transition-opacity">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#050E1D] font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, #00E599, #38BDF8)' }}
              >
                CP
              </div>
              <span className="font-bold text-base tracking-tight hidden sm:inline">Checkpoint</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm text-cyan-400 font-medium">SIP Change Flow</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xs sm:text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
              Dashboard
            </Link>
            <Link href="/" className="text-xs sm:text-sm text-slate-400 hover:text-white px-2 py-1.5 transition-colors">
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────── */}
      <main className="page-container py-8 md:py-12">
        {/* Ambient glows — fixed, not in layout flow */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div style={{
            position: 'absolute', top: 0, right: '20%',
            width: 550, height: 260,
            background: 'rgba(56,189,248,0.09)',
            borderRadius: '50%',
            filter: 'blur(95px)',
          }} />
          <div style={{
            position: 'absolute', bottom: 40, left: 40,
            width: 460, height: 360,
            background: 'rgba(0,229,153,0.08)',
            borderRadius: '50%',
            filter: 'blur(105px)',
          }} />
        </div>

        <div className="relative z-10" style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Step header */}
          <header className="mb-7 fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="status-indicator status-info">Step 1 of 2</span>
              <span className="text-xs text-slate-400">Configure parameters &amp; intent</span>
            </div>
            <h1 className="text-heading-1 text-white mb-1.5">SIP Modification Simulation</h1>
            <p className="text-body text-slate-300">
              Select an investor persona or customise parameters below, then trigger a cancellation or pause to observe the intervention engine.
            </p>
          </header>

          {/* ── Step 1: Portfolio Setup ── */}
          <section className="card-glass p-6 mb-6 slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-3 text-white flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold"
                  style={{ background: 'rgba(0,229,153,0.15)', color: '#00E599' }}
                >
                  1
                </span>
                Portfolio &amp; Goal Setup
              </h2>
              <span className="text-xs text-slate-400 hidden sm:inline">Choose a preset or adjust values</span>
            </div>

            {/* Preset cards */}
            <div className="mb-5">
              <label className="label-text mb-2">Investor Personas</label>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {SIP_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetChange(preset.id)}
                    className={`select-card${selectedPreset === preset.id ? ' selected' : ''}`}
                    aria-pressed={selectedPreset === preset.id}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-sm">{preset.name}</span>
                      {selectedPreset === preset.id && (
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ background: '#00E599', boxShadow: '0 0 6px rgba(0,229,153,0.7)' }}
                        />
                      )}
                    </div>
                    <div className="text-tiny text-slate-400 leading-snug">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fundName" className="label-text">Fund Name</label>
                <input
                  id="fundName"
                  type="text"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  className="input-base"
                  placeholder="e.g., Parag Parikh Flexi Cap Fund"
                />
              </div>

              <div>
                <label htmlFor="monthlyAmount" className="label-text">
                  <span>Monthly SIP Amount</span>
                  <span className="font-numeric font-medium" style={{ color: '#00E599' }}>
                    ₹{monthlyAmount.toLocaleString('en-IN')}
                  </span>
                </label>
                <input
                  id="monthlyAmount"
                  type="number"
                  min={500}
                  max={100000}
                  step={500}
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="input-base font-numeric"
                />
              </div>

              <div>
                <label htmlFor="currentValue" className="label-text">
                  <span>Current Corpus</span>
                  <span className="font-numeric font-medium" style={{ color: '#38BDF8' }}>
                    ₹{currentValue.toLocaleString('en-IN')}
                  </span>
                </label>
                <input
                  id="currentValue"
                  type="number"
                  min={0}
                  max={10000000}
                  step={10000}
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="input-base font-numeric"
                />
              </div>

              <div>
                <label htmlFor="goalAmount" className="label-text">
                  <span>Target Goal Corpus</span>
                  <span className="font-numeric font-medium" style={{ color: '#FBBF24' }}>
                    ₹{goalAmount.toLocaleString('en-IN')}
                  </span>
                </label>
                <input
                  id="goalAmount"
                  type="number"
                  min={100000}
                  max={100000000}
                  step={100000}
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}
                  className="input-base font-numeric"
                />
              </div>

              {/* Year slider */}
              <div
                className="sm:col-span-2 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="yearsToGoal" className="label-text mb-0">
                    Investment Time Horizon
                  </label>
                  <span
                    className="font-numeric font-bold text-lg"
                    style={{ color: '#00E599' }}
                  >
                    {yearsToGoal} {yearsToGoal === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <input
                  id="yearsToGoal"
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={yearsToGoal}
                  onChange={(e) => setYearsToGoal(Number(e.target.value))}
                  aria-label="Years to goal"
                />
                <div className="flex justify-between text-tiny text-slate-500 mt-1.5 font-numeric">
                  <span>1 yr</span><span>10 yrs</span><span>20 yrs</span><span>30 yrs</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Step 2: Action ── */}
          <section className="card-glass p-6 mb-6 slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-heading-3 text-white flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold"
                style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8' }}
              >
                2
              </span>
              What do you want to do?
            </h2>

            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }} role="radiogroup" aria-label="Select SIP action">
              {ACTIONS.map((a) => {
                const isSelected = action === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setAction(a.id)}
                    className="p-5 rounded-xl border-2 text-left transition-all"
                    style={{
                      background: isSelected ? a.bgSel : 'rgba(255,255,255,0.02)',
                      borderColor: isSelected ? a.borderSel : 'rgba(255,255,255,0.08)',
                      boxShadow: isSelected ? `0 0 20px rgba(0,0,0,0.2)` : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-sm">{a.label}</span>
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full transition-all"
                        style={{
                          background: isSelected ? a.borderSel : 'rgba(255,255,255,0.15)',
                          boxShadow: isSelected ? `0 0 8px ${a.borderSel}` : 'none',
                        }}
                      />
                    </div>
                    <p className="text-tiny leading-snug" style={{ color: '#94A3B8' }}>{a.sub}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Step 3: Reason ── */}
          {action && (
            <section className="card-glass p-6 mb-6 slide-up" style={{ animationDelay: '150ms' }}>
              <h2 className="text-heading-3 text-white flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold"
                  style={{ background: 'rgba(168,85,247,0.15)', color: '#A855F7' }}
                >
                  3
                </span>
                Why are you doing this?
              </h2>
              <p className="text-small text-slate-400 mb-4">
                Contextualises the AI guidance and provides accurate historical framing.
              </p>

              <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Select reason">
                {(Object.keys(REASON_LABELS) as PauseReason[]).map((key) => {
                  const isSelected = reason === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setReason(key)}
                      className="p-4 rounded-xl border text-left flex items-center justify-between transition-all"
                      style={{
                        background: isSelected ? 'rgba(0,229,153,0.07)' : 'rgba(255,255,255,0.02)',
                        borderColor: isSelected ? '#00E599' : 'rgba(255,255,255,0.08)',
                        boxShadow: isSelected ? '0 0 16px rgba(0,229,153,0.18)' : 'none',
                        color: isSelected ? '#ffffff' : '#94A3B8',
                      }}
                    >
                      <span className="text-small font-medium">{REASON_LABELS[key]}</span>
                      {isSelected && (
                        <span className="font-bold text-sm ml-2 shrink-0" style={{ color: '#00E599' }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── CTA ── */}
          {action && reason && (
            <div className="text-center slide-up py-2" style={{ animationDelay: '200ms' }}>
              <button
                type="button"
                onClick={() => setShowIntervention(true)}
                className="btn-base btn-primary btn-lg"
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '2.5rem',
                  boxShadow: '0 0 28px rgba(0,229,153,0.38)',
                }}
              >
                Trigger Checkpoint Intervention
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-xs text-slate-500 mt-3">
                Simulated sandbox environment · No live transactions executed
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
