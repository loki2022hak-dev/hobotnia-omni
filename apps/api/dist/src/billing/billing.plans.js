"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIP_PLANS = void 0;
exports.getVipPlan = getVipPlan;
exports.VIP_PLANS = [
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
function getVipPlan(code) {
    return exports.VIP_PLANS.find((plan) => plan.code === code);
}
//# sourceMappingURL=billing.plans.js.map