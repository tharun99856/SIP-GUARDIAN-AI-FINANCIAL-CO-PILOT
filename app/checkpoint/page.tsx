'use client';

import { useState } from 'react';
import CheckpointScreen from '@/components/CheckpointScreen';
import { SIPDetails, SIPAction } from '@/types';

// Demo data for testing
const demoSIPDetails: SIPDetails = {
  sipId: 'SIP001',
  investorId: 'USER123',
  monthlyAmount: 10000,
  startDate: '2022-01-01',
  fundName: 'HDFC Equity Growth Fund',
  fundType: 'equity',
  currentValue: 280000,
  goalName: 'Retirement Fund',
  goalAmount: 5000000,
  goalDate: '2035-12-31',
};

export default function CheckpointPage() {
  const [action, setAction] = useState<SIPAction>('cancel');
  const [showCheckpoint, setShowCheckpoint] = useState(false);

  const handleActionChange = (newAction: SIPAction) => {
    setAction(newAction);
    setShowCheckpoint(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        {!showCheckpoint ? (
          <div className="max-w-3xl mx-auto">
            <div className="card-glass rounded-2xl p-10 animate-fade-in">
              <div className="border-l-4 border-cyan-500 pl-6 mb-8">
                <h1 className="text-4xl font-bold text-white mb-3">
                  Checkpoint Demo
                </h1>
                <p className="text-gray-300 text-lg">
                  Choose a scenario below to see how we intervene when investors try to change their SIP
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="font-semibold text-xl mb-4 text-cyan-400">Your Current SIP</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Fund</p>
                      <p className="text-white font-medium">{demoSIPDetails.fundName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Monthly Investment</p>
                      <p className="text-white font-medium">₹{demoSIPDetails.monthlyAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Current Value</p>
                      <p className="text-white font-medium">₹{demoSIPDetails.currentValue?.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Goal</p>
                      <p className="text-white font-medium">{demoSIPDetails.goalName} (₹{demoSIPDetails.goalAmount?.toLocaleString('en-IN')})</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
                    Choose Your Scenario
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleActionChange('cancel')}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all group ${
                        action === 'cancel'
                          ? 'border-red-500 bg-red-500/10 shadow-lg'
                          : 'border-slate-700 bg-slate-800/30 hover:border-red-400 hover:bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg text-white mb-1">❌ Cancel SIP Completely</div>
                          <div className="text-sm text-gray-400">Stop all future investments permanently</div>
                        </div>
                        {action === 'cancel' && (
                          <div className="text-red-400 text-2xl">→</div>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => handleActionChange('pause')}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all group ${
                        action === 'pause'
                          ? 'border-orange-500 bg-orange-500/10 shadow-lg'
                          : 'border-slate-700 bg-slate-800/30 hover:border-orange-400 hover:bg-orange-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg text-white mb-1">⏸️ Pause for 6 Months</div>
                          <div className="text-sm text-gray-400">Temporarily stop, resume later</div>
                        </div>
                        {action === 'pause' && (
                          <div className="text-orange-400 text-2xl">→</div>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => handleActionChange('reduce')}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all group ${
                        action === 'reduce'
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg'
                          : 'border-slate-700 bg-slate-800/30 hover:border-cyan-400 hover:bg-cyan-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg text-white mb-1">📉 Reduce to ₹5,000/month</div>
                          <div className="text-sm text-gray-400">Cut your monthly investment in half</div>
                        </div>
                        {action === 'reduce' && (
                          <div className="text-cyan-400 text-2xl">→</div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckpoint(true)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-[1.02] glow-cyan transition-all"
                >
                  Proceed with {action === 'cancel' ? 'Cancellation' : action === 'pause' ? 'Pause' : 'Reduction'} →
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Demo mode • Your actual SIP won't be affected
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>This is a demo. No actual SIP changes will be made.</p>
            </div>
          </div>
        ) : (
          <CheckpointScreen
            sipDetails={demoSIPDetails}
            action={action}
            onConfirm={(data) => {
              console.log('Confirmed:', data);
              alert('Action confirmed! (Demo mode - no actual changes made)');
              setShowCheckpoint(false);
            }}
            onCancel={() => {
              console.log('Cancelled');
              setShowCheckpoint(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
