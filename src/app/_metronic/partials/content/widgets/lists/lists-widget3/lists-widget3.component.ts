// mixed-widget7.component.ts
import { Component, OnInit } from '@angular/core';
import { DiscountService } from 'src/app/modules/discount/service/discount.service';

interface DiscountMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  normalCampaigns: number;
  flashCampaigns: number;
  bannerCampaigns: number;
}
@Component({
  selector: 'app-lists-widget3',
  templateUrl: './lists-widget3.component.html',
})
export class ListsWidget3Component implements OnInit{
  metrics: DiscountMetrics = {
    totalCampaigns: 0,
    activeCampaigns: 0,
    normalCampaigns: 0,
    flashCampaigns: 0,
    bannerCampaigns: 0
  };
  isLoading: any = null;
  recentDiscounts: any = [];

  constructor(
    public discountService: DiscountService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.discountService.isLoading$;
    this.loadMetrics();
  }

  loadMetrics() {
    this.discountService.listDiscount(null, null).subscribe((resp: any) => {
      const allDiscounts = resp.discounts.data;
      const now = new Date();
      
      // Calculando métricas
      this.metrics.totalCampaigns = allDiscounts.length;
      this.metrics.activeCampaigns = allDiscounts.filter((discount: any) => {
        const startDate = new Date(discount.start_date);
        const endDate = new Date(discount.end_date);
        return startDate <= now && endDate >= now && discount.state === 1;
      }).length;
      
      this.metrics.normalCampaigns = allDiscounts.filter((discount: any) => discount.type_campaing === 1).length;
      this.metrics.flashCampaigns = allDiscounts.filter((discount: any) => discount.type_campaing === 2).length;
      this.metrics.bannerCampaigns = allDiscounts.filter((discount: any) => discount.type_campaing === 3).length;
      
      this.recentDiscounts = allDiscounts.slice(0, 5);
    });
  }

  getCampaignType(type: number): string {
    switch(type) {
      case 1: return 'Normal';
      case 2: return 'Flash';
      case 3: return 'Banner';
      default: return 'Desconocido';
    }
  }

  getCampaignStatus(discount: any): string {
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = new Date(discount.end_date);

    if (discount.state !== 1) return 'Inactivo';
    if (now < startDate) return 'Por iniciar';
    if (now > endDate) return 'Finalizado';
    return 'Activo';
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Activo': return 'badge-light-success';
      case 'Por iniciar': return 'badge-light-warning';
      case 'Finalizado': return 'badge-light-danger';
      default: return 'badge-light-secondary';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}