import api from './axios';
import BASE_URL from './config';
import type { CreateOrderPayload, CreateOrderResponse, VerifyPaymentPayload } from '../types';

const paymentService = {
  createOrder: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const { data } = await api.post<{ data: CreateOrderResponse }>(`${BASE_URL}/payments/create-order`, payload);
    return data.data;
  },

  verifyPayment: async (payload: VerifyPaymentPayload): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post<{ success: boolean; message: string }>(`${BASE_URL}/payments/verify`, payload);
    return data;
  },
};

export default paymentService;
