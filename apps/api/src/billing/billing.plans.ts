export type VipPlan = {
  code: string;
  title: string;
  amountUsd: number;
  days: number;
  perks: string[];
};

export const VIP_PLANS: VipPlan[] = [
  {
    code: 'vip_week',
    title: 'VIP 7 днів',
    amountUsd: 2,
    days: 7,
    perks: ['Premium роль', 'пріоритет у стрічці', 'розширені ліміти постів', 'VIP бейдж']
  },
  {
    code: 'vip_month',
    title: 'VIP 30 днів',
    amountUsd: 5,
    days: 30,
    perks: ['Premium роль', 'пріоритет у стрічці', 'розширені ліміти постів', 'VIP бейдж', 'доступ до premium вакансій']
  },
  {
    code: 'vip_quarter',
    title: 'VIP 90 днів',
    amountUsd: 13,
    days: 90,
    perks: ['Premium роль', 'пріоритет у стрічці', 'розширені ліміти постів', 'VIP бейдж', 'доступ до premium вакансій', 'кращий тариф']
  }
];

export function getVipPlan(code: string) {
  return VIP_PLANS.find((plan) => plan.code === code);
}
