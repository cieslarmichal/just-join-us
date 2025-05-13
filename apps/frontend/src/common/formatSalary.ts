export function formatSalary(minSalary: number, maxSalary: number): string {
  const formattedMinSalary = minSalary.toLocaleString('pl-PL');
  const formattedMaxSalary = maxSalary.toLocaleString('pl-PL');

  return `${formattedMinSalary} - ${formattedMaxSalary} PLN/month`;
}
