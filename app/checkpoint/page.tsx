'use client';

import { useState } from 'react';
import { SIPPreset, SIPAction, PauseReason } from '@/types';
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
    <div className="min-h-screen bg-[#0B1B3F] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="accent-bar-purple mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              SIP Change Request
            </h1>
            <p className="text-[#5CD6F0]">
              Before we proceed, let us show you what this decision means for your goal.
            </p>
          </div>
        </div>

        {/* Step 1: Select or Customize SIP */}
        <div className="card-surface mb-6 p-6 fade-in">
          <h2 className="text-xl font-bold text-white mb-4">Your SIP Details</h2>
          
          {/* Preset Selection */}
          <div className="mb-6">
            <label className="block text-sm text-[#94A3B8] mb-3 uppercase tracking-wide">
              Quick Presets
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {SIP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`p-4 rounded-lg border text-left transition-all btn ${
                    selectedPreset === preset.id
                      ? 'bg-[#0F9D8A]/10 border-[#0F9D8A]'
                      : 'bg-transparent border-[#0F9D8A]/40 hover:border-[#0F9D8A]'
                  }`}
                >
                  <div className="font-bold text-white text-sm mb-1">{preset.name}</div>
                  <div className="text-xs text-[#94A3B8]">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editable Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">Fund Name</label>
              <input
                type="text"
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                className="w-full bg-[#0B1B3F] border border-[#0F9D8A]/40 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Monthly SIP Amount (₹)
              </label>
              <input
                type="number"
                min="500"
                max="100000"
                step="500"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full bg-[#0B1B3F] border border-[#0F9D8A]/40 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Current Value (₹)
              </label>
              <input
                type="number"
                min="0"
                max="10000000"
                step="10000"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="w-full bg-[#0B1B3F] border border-[#0F9D8A]/40 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Goal Amount (₹)
              </label>
              <input
                type="number"
                min="100000"
                max="100000000"
                step="100000"
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                className="w-full bg-[#0B1B3F] border border-[#0F9D8A]/40 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-[#94A3B8] mb-2">
                Years to Goal: {yearsToGoal} years
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={yearsToGoal}
                onChange={(e) => setYearsToGoal(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Select Action */}
        <div className="card-surface mb-6 p-6 fade-in">
          <h2 className="text-xl font-bold text-white mb-4">What do you want to do?</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setAction('cancel')}
              className={`w-full p-5 rounded-lg border-2 text-left transition-all btn ${
                action === 'cancel'
                  ? 'bg-[#EF4444]/10 border-[#EF4444]'
                  : 'bg-transparent border-[#0F9D8A]/40 hover:border-[#EF4444]'
              }`}
            >
              <div className="font-bold text-white mb-1">Cancel SIP Completely</div>
              <div className="text-sm text-[#94A3B8]">Stop all future investments permanently</div>
            </button>

            <button
              onClick={() => setAction('pause')}
              className={`w-full p-5 rounded-lg border-2 text-left transition-all btn ${
                action === 'pause'
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B]'
                  : 'bg-transparent border-[#0F9D8A]/40 hover:border-[#F59E0B]'
              }`}
            >
              <div className="font-bold text-white mb-1">Pause for 6 Months</div>
              <div className="text-sm text-[#94A3B8]">Temporarily stop, resume later</div>
            </button>

            <button
              onClick={() => setAction('reduce')}
              className={`w-full p-5 rounded-lg border-2 text-left transition-all btn ${
                action === 'reduce'
                  ? 'bg-[#5CD6F0]/10 border-[#5CD6F0]'
                  : 'bg-transparent border-[#0F9D8A]/40 hover:border-[#5CD6F0]'
              }`}
            >
              <div className="font-bold text-white mb-1">Reduce to ₹{Math.floor(monthlyAmount / 2).toLocaleString('en-IN')}/month</div>
              <div className="text-sm text-[#94A3B8]">Cut your monthly investment</div>
            </button>
          </div>
        </div>

        {/* Step 3: Select Reason (only if action selected) */}
        {action && (
          <div className="card-surface mb-6 p-6 fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Why are you doing this?</h2>
            <p className="text-sm text-[#94A3B8] mb-4">
              This helps us show you relevant information for your situation.
            </p>
            
            <div className="space-y-3">
              {(Object.keys(REASON_LABELS) as PauseReason[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setReason(key)}
                  className={`w-full p-4 rounded-lg border text-left transition-all btn ${
                    reason === key
                      ? 'bg-[#0F9D8A]/10 border-[#0F9D8A]'
                      : 'bg-transparent border-[#0F9D8A]/40 hover:border-[#0F9D8A]'
                  }`}
                >
                  <div className="text-white">{REASON_LABELS[key]}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proceed Button (only if both action and reason selected) */}
        {action && reason && (
          <div className="text-center fade-in">
            <button
              onClick={handleProceed}
              className="bg-[#0F9D8A] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#0F9D8A]/90 btn"
            >
              Show Me the Impact
            </button>
            <p className="text-[#94A3B8] text-sm mt-4">
              Demo mode. Your actual SIP will not be affected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
