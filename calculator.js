const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const inputs = Array.from(document.querySelectorAll('input, select'));
const output = {
  monthly: document.querySelector('[data-monthly]'),
  yearly: document.querySelector('[data-yearly]'),
  jobs: document.querySelector('[data-jobs]'),
  afterHours: document.querySelector('[data-after-hours]')
};

function numberValue(id) {
  const el = document.getElementById(id);
  const value = Number(el.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function calculate() {
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

  output.monthly.textContent = money.format(monthly);
  output.yearly.textContent = money.format(yearly);
  output.jobs.textContent = bookedJobs.toFixed(1);
  output.afterHours.textContent = money.format(emergencyExtra);
}

inputs.forEach((input) => input.addEventListener('input', calculate));
calculate();
