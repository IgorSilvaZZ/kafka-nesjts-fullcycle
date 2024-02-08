export interface CreatePaymentDTO {
  amount: number;
  order_id: string;
  client_id: string;
  status: string;
}
