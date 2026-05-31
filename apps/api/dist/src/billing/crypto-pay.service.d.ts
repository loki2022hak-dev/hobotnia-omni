type CryptoInvoice = {
    invoice_id: number;
    status: string;
    bot_invoice_url?: string;
    mini_app_invoice_url?: string;
    web_app_invoice_url?: string;
    payload?: string;
};
export declare class CryptoPayService {
    private baseUrl;
    private token;
    verifySignature(body: unknown, signature?: string | string[]): boolean;
    assertWebhookSecret(secret: string): void;
    createInvoice(params: {
        amountUsd: number;
        description: string;
        payload: string;
        paidBtnUrl: string;
    }): Promise<CryptoInvoice>;
    getInvoice(invoiceId: string): Promise<CryptoInvoice | undefined>;
    private request;
}
export {};
