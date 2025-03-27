'use client';

import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DealAnalyzer({ property }) {
  const [inputs, setInputs] = useState({
    purchasePrice: property?.price || 0,
    downPaymentPct: 20,
    interestRate: 4.5,
    loanTerm: 30,
    monthlyRent: property?.price ? property.price * 0.001 : 0,
    annualTaxes: property?.price ? property.price * 0.012 : 0,
    annualInsurance: 1000,
    monthlyExpenses: 200,
  });

  if (!property) return <p>Select a property to analyze</p>;

  const calculateMortgage = (principal, rate, years) => {
    const monthlyRate = rate / 12 / 100;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const downPayment = inputs.purchasePrice * (inputs.downPaymentPct / 100);
  const loanAmount = inputs.purchasePrice - downPayment;
  const monthlyMortgage = calculateMortgage(loanAmount, inputs.interestRate, inputs.loanTerm);
  const monthlyExpensesTotal = monthlyMortgage + (inputs.annualTaxes / 12) + (inputs.annualInsurance / 12) + inputs.monthlyExpenses;
  const monthlyCashFlow = inputs.monthlyRent - monthlyExpensesTotal;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashReturn = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;
  const capRate = inputs.purchasePrice > 0 ? ((inputs.monthlyRent * 12 - (inputs.annualTaxes + inputs.annualInsurance + inputs.monthlyExpenses * 12)) / inputs.purchasePrice) * 100 : 0;

  const pieData = {
    labels: ['Mortgage', 'Taxes', 'Insurance', 'Other Expenses'],
    datasets: [{
      data: [monthlyMortgage, inputs.annualTaxes/12, inputs.annualInsurance/12, inputs.monthlyExpenses],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Deal Analysis for {property.address || 'Unknown'}</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <input type="number" value={inputs.purchasePrice} onChange={e => setInputs({...inputs, purchasePrice: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded" placeholder="Purchase Price" />
          <input type="number" value={inputs.downPaymentPct} onChange={e => setInputs({...inputs, downPaymentPct: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded mt-2" placeholder="Down Payment %" />
          <input type="number" value={inputs.interestRate} step="0.1" onChange={e => setInputs({...inputs, interestRate: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded mt-2" placeholder="Interest Rate" />
          <input type="number" value={inputs.loanTerm} onChange={e => setInputs({...inputs, loanTerm: parseInt(e.target.value) || 1})} className="w-full p-2 border rounded mt-2" placeholder="Loan Term" />
        </div>
        <div>
          <input type="number" value={inputs.monthlyRent} onChange={e => setInputs({...inputs, monthlyRent: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded" placeholder="Monthly Rent" />
          <input type="number" value={inputs.annualTaxes} onChange={e => setInputs({...inputs, annualTaxes: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded mt-2" placeholder="Annual Taxes" />
          <input type="number" value={inputs.annualInsurance} onChange={e => setInputs({...inputs, annualInsurance: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded mt-2" placeholder="Annual Insurance" />
          <input type="number" value={inputs.monthlyExpenses} onChange={e => setInputs({...inputs, monthlyExpenses: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded mt-2" placeholder="Monthly Expenses" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p><strong>Monthly Cash Flow:</strong> ${monthlyCashFlow.toFixed(2)}</p>
          <p><strong>Annual Cash Flow:</strong> ${annualCashFlow.toFixed(2)}</p>
        </div>
        <div>
          <p><strong>Cash on Cash Return:</strong> {cashOnCashReturn.toFixed(2)}%</p>
          <p><strong>Cap Rate:</strong> {capRate.toFixed(2)}%</p>
        </div>
        <div>
          <p><strong>Monthly Mortgage:</strong> ${monthlyMortgage.toFixed(2)}</p>
          <p><strong>Total Monthly Expenses:</strong> ${monthlyExpensesTotal.toFixed(2)}</p>
        </div>
      </div>
      <div className="w-1/2 mx-auto">
        <Pie data={pieData} />
      </div>
    </div>
  );
}
