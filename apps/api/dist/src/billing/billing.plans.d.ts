export type VipPlan = {
    code: string;
    title: string;
    amountUsd: number;
    days: number;
    perks: string[];
};
export declare const VIP_PLANS: VipPlan[];
export declare function getVipPlan(code: string): VipPlan | undefined;
