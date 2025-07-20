import { apiClient } from "@/config/api-client";



export class InstallmentService {

  static async deleteInstallment(installmentId: string) {
    await apiClient.delete(`/installments/${installmentId}`);
    return 
  }

}