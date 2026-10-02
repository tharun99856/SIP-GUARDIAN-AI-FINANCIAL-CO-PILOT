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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {!showCheckpoint ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                SIP Change Demo
              </h1>
              <p className="text-gray-600 mb-8">
                Select an action to see the Checkpoint intervention screen
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-lg mb-2">Current SIP Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Fund:</span> {demoSIPDetails.fundName}</p>
                    <p><span className="font-medium">Monthly Amount:</span> ₹{demoSIPDetails.monthlyAmount.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">Current Value:</span> ₹{demoSIPDetails.currentValue?.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">Goal:</span> {demoSIPDetails.goalName} (₹{demoSIPDetails.goalAmount?.toLocaleString('en-IN')})</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What would you like to do?
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleActionChange('cancel')}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        action === 'cancel'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-lg">❌ Cancel SIP</div>
                      <div className="text-sm text-gray-600">Stop all future investments</div>
                    </button>

                    <button
                      onClick={() => handleActionChange('pause')}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        action === 'pause'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-lg">⏸️ Pause SIP</div>
                      <div className="text-sm text-gray-600">Temporarily stop for a few months</div>
                    </button>

                    <button
                      onClick={() => handleActionChange('reduce')}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        action === 'reduce'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-lg">📉 Reduce Amount</div>
                      <div className="text-sm text-gray-600">Lower your monthly investment</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckpoint(true)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue with {action === 'cancel' ? 'Cancellation' : action === 'pause' ? 'Pause' : 'Reduction'}
                </button>
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
