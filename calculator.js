const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const inputs = Array.from(document.querySelectorAll('input, select'));
const output = {
  monthly: document.querySelector('[data-monthly]'),
  yearly: document.querySelector('[data-yearly]'),
  jobs: document.querySelector('[data-jobs]'),
  afterHours: document.querySelector('[data-after-hours]'),
  roi: document.querySelector('[data-roi]')
};

function numberValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const value = Number(el.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function setText(node, value) {
  if (node) node.textContent = value;
}

function calculateStandard() {
  const missedCalls = numberValue('missedCalls');
  const bookingRate = numberValue('bookingRate') / 100;
  const averageJob = numberValue('averageJob');
  const emergencyShare = numberValue('emergencyShare') / 100;
  const emergencyLift = numberValue('emergencyLift') / 100;

  const bookedJobs = missedCalls * bookingRate;
  const baseRevenue = bookedJobs * averageJob;
  const emergencyExtra = bookedJobs * emergencyShare * averageJob * emergencyLift;
  const monthly = baseRevenue + emergencyExtra;
  const yearly = monthly * 12;

  setText(output.monthly, money.format(monthly));
  setText(output.yearly, money.format(yearly));
  setText(output.jobs, bookedJobs.toFixed(1));
  setText(output.afterHours, money.format(emergencyExtra));
}

function calculateReceptionistRoi() {
  const monthlyCost = numberValue('monthlyCost');
  const missedCalls = numberValue('missedCalls');
  const bookingRate = numberValue('bookingRate') / 100;
  const averageJob = numberValue('averageJob');
  const recoveredShare = numberValue('recoveredShare') / 100;

  const recoveredJobs = missedCalls * bookingRate * recoveredShare;
  const recoveredValue = recoveredJobs * averageJob;
  const netMonthly = recoveredValue - monthlyCost;
  const yearlyNet = netMonthly * 12;
  const roiMultiple = monthlyCost > 0 ? recoveredValue / monthlyCost : 0;

  setText(output.monthly, money.format(recoveredValue));
  setText(output.jobs, recoveredJobs.toFixed(1));
  setText(output.afterHours, money.format(netMonthly));
  setText(output.yearly, money.format(yearlyNet));
  setText(output.roi, `${roiMultiple.toFixed(1)}x`);
}

function calculate() {
  if (document.body.dataset.calculator === 'receptionist-roi') {
    calculateReceptionistRoi();
  } else {
    calculateStandard();
  }
}

inputs.forEach((input) => input.addEventListener('input', calculate));
calculate();
