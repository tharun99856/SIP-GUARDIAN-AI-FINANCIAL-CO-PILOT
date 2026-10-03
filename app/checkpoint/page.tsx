'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SIPAction, PauseReason } from '@/types';
import { SIP_PRESETS, REASON_LABELS } from '@/lib/presets';
import CheckpointIntervention from '@/components/CheckpointIntervention';

export default function CheckpointPage() {
  // Step 1: Select or customize SIP
  const [selectedPreset, setSelectedPreset] = useState<string>(SIP_PRESETS[0].id);
  const [monthlyAmount, setMonthlyAmount] = useState(SIP_PRESETS[0].monthlyAmount);
  const [currentValue, setCurrentValue] = useState(SIP_PRESETS[0].currentValue);
  const [goalAmount, setGoalAmount] = useState(SIP_PRESETS[0].goalAmount);
  const [yearsToGoal, setYearsToGoal] = useState(SIP_PRESETS[0].yearsToGoal);
  const [fundName, setFundName] = useState(SIP_PRESETS[0].fundName);
  
  // Step 2: Select action
  const [action, setAction] = useState<SIPAction | null>(null);
  
  // Step 3: Select reason
  const [reason, setReason] = useState<PauseReason | null>(null);
  
  // Step 4: Show intervention
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

  const handleProceed = () => {
    if (action && reason) {
      setShowIntervention(true);
    }
  };

  const handleBack = () => {
    setShowIntervention(false);
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
        onBack={handleBack}
      />
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-grid-pattern">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-teal-500/10 blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="backdrop-blur-md bg-[#060B18]/70 border-b border-white/[0.06] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(0,229,153,0.3)]">
                CP
              </div>
              <span className="font-bold tracking-tight text-white hidden sm:inline">Checkpoint</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm text-cyan-400 font-medium">SIP Change Request Flow</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="text-xs sm:text-sm text-slate-400 hover:text-white px-2.5 py-1.5 transition-colors"
            >
              Exit Demo
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {/* Step Flow Header */}
        <header className="mb-8 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="status-indicator status-info text-xs">Step 1 of 2</span>
            <span className="text-xs text-slate-400">Configure parameters & user intent</span>
          </div>
          <h1 className="text-heading-1 text-white mb-2">
            SIP Modification Simulation
          </h1>
          <p className="text-body text-slate-300">
            Select a realistic investor persona or customize the parameters below, then trigger a cancellation or pause to observe the real-time intervention engine.
          </p>
        </header>

        {/* Step 1: Select or Customize SIP */}
        <section className="card-glass p-6 md:p-8 mb-8 slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-heading-3 text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-400/20 text-teal-300 flex items-center justify-center text-xs font-bold">1</span>
              Portfolio & Goal Setup
            </h2>
            <span className="text-xs text-slate-400">Choose a preset or adjust sliders</span>
          </div>
          
          {/* Preset Selection */}
          <div className="mb-6">
            <label className="label-text">
              <span>Investor Personas (Presets)</span>
              <span className="text-slate-400 text-tiny font-normal">Click to quick-load</span>
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {SIP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetChange(preset.id)}
                  className={`select-card ${selectedPreset === preset.id ? 'selected' : ''}`}
                  aria-pressed={selectedPreset === preset.id}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white text-sm">{preset.name}</span>
                    {selectedPreset === preset.id && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                    )}
                  </div>
                  <div className="text-tiny text-slate-400 leading-snug">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fundName" className="label-text">Fund Name</label>
              <div className="input-container">
                <input
                  id="fundName"
                  type="text"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  className="input-base text-white"
                  placeholder="e.g., Parag Parikh Flexi Cap Fund"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="monthlyAmount" className="label-text">
                <span>Monthly SIP Amount</span>
                <span className="text-teal-400 font-numeric font-medium">₹{monthlyAmount.toLocaleString('en-IN')}</span>
              </label>
              <div className="input-container">
                <input
                  id="monthlyAmount"
                  type="number"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="input-base font-numeric text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="currentValue" className="label-text">
                <span>Current Accumulated Corpus</span>
                <span className="text-cyan-400 font-numeric font-medium">₹{currentValue.toLocaleString('en-IN')}</span>
              </label>
              <div className="input-container">
                <input
                  id="currentValue"
                  type="number"
                  min="0"
                  max="10000000"
                  step="10000"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="input-base font-numeric text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="goalAmount" className="label-text">
                <span>Target Goal Corpus</span>
                <span className="text-amber-400 font-numeric font-medium">₹{goalAmount.toLocaleString('en-IN')}</span>
              </label>
              <div className="input-container">
                <input
                  id="goalAmount"
                  type="number"
                  min="100000"
                  max="100000000"
                  step="100000"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}
                  className="input-base font-numeric text-white"
                />
              </div>
            </div>

            {/* Range Slider for Years */}
            <div className="sm:col-span-2 mt-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="yearsToGoal" className="label-text mb-0">
                  <span>Investment Time Horizon</span>
                </label>
                <span className="text-heading-3 text-teal-400 font-numeric font-bold">
                  {yearsToGoal} {yearsToGoal === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                id="yearsToGoal"
                type="range"
                min="1"
                max="30"
                step="1"
                value={yearsToGoal}
                onChange={(e) => setYearsToGoal(Number(e.target.value))}
                aria-label="Years to goal"
              />
              <div className="flex justify-between text-tiny text-slate-500 mt-2 font-numeric">
                <span>1 Year</span>
                <span>10 Years</span>
                <span>20 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Select Action */}
        <section className="card-glass p-6 md:p-8 mb-8 slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-3 text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xs font-bold">2</span>
              Intended Action (Simulated User Trigger)
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-3" role="radiogroup" aria-label="Select SIP action">
            {/* Cancel Action */}
            <button
              type="button"
              role="radio"
              aria-checked={action === 'cancel'}
              onClick={() => setAction('cancel')}
              className={`p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                action === 'cancel'
                  ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)] ring-1 ring-rose-400'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-rose-400/50 hover:bg-rose-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm">Cancel SIP</span>
                <span className={`w-2.5 h-2.5 rounded-full ${action === 'cancel' ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-600'}`}></span>
              </div>
              <p className="text-tiny text-slate-300 leading-snug">Permanently stops all monthly contributions.</p>
            </button>

            {/* Pause Action */}
            <button
              type="button"
              role="radio"
              aria-checked={action === 'pause'}
              onClick={() => setAction('pause')}
              className={`p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                action === 'pause'
                  ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-amber-400/50 hover:bg-amber-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm">Pause for 6 Months</span>
                <span className={`w-2.5 h-2.5 rounded-full ${action === 'pause' ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-slate-600'}`}></span>
              </div>
              <p className="text-tiny text-slate-300 leading-snug">Temporarily pauses SIP, resuming automatically later.</p>
            </button>

            {/* Reduce Action */}
            <button
              type="button"
              role="radio"
              aria-checked={action === 'reduce'}
              onClick={() => setAction('reduce')}
              className={`p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                action === 'reduce'
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.3)] ring-1 ring-cyan-300'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-cyan-400/50 hover:bg-cyan-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm">Reduce SIP to 50%</span>
                <span className={`w-2.5 h-2.5 rounded-full ${action === 'reduce' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-slate-600'}`}></span>
              </div>
              <p className="text-tiny text-slate-300 leading-snug">Cuts installment to ₹{Math.floor(monthlyAmount / 2).toLocaleString('en-IN')}/mo.</p>
            </button>
          </div>
        </section>

        {/* Step 3: Select Reason */}
        {action && (
          <section className="card-glass p-6 md:p-8 mb-8 slide-up" style={{ animationDelay: '150ms' }}>
            <div className="mb-4">
              <h2 className="text-heading-3 text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-400/20 text-indigo-300 flex items-center justify-center text-xs font-bold">3</span>
                Primary Trigger Reason
              </h2>
              <p className="text-small text-slate-400 mt-1">
                Contextualizes the AI guidance and provides accurate historical framing.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Select reason">
              {(Object.keys(REASON_LABELS) as PauseReason[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={reason === key}
                  onClick={() => setReason(key)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    reason === key
                      ? 'bg-teal-950/40 border-teal-400 shadow-[0_0_20px_rgba(0,229,153,0.25)] text-white ring-1 ring-teal-400'
                      : 'bg-white/[0.02] border-white/[0.08] hover:border-teal-400/40 hover:bg-teal-500/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-small font-medium">{REASON_LABELS[key]}</span>
                  {reason === key && (
                    <span className="text-teal-400 font-bold text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Proceed CTA Button */}
        {action && reason && (
          <div className="text-center slide-up py-4" style={{ animationDelay: '200ms' }}>
            <button
              type="button"
              onClick={handleProceed}
              className="btn-base btn-primary btn-lg px-10 shadow-[0_0_30px_rgba(0,229,153,0.4)]"
            >
              Trigger Checkpoint Intervention
              <svg className="w-5 h-5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-xs text-slate-500 mt-3">
              Simulated sandbox environment • No live transactions executed
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
