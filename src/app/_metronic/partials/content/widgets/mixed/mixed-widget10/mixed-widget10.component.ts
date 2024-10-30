// mixed-widget6.component.ts
import { Component, OnInit } from '@angular/core';
import { CouponService } from 'src/app/modules/coupon/service/coupon.service';

interface CouponMetrics {
  totalCoupons: number;
  activeCoupons: number;
  percentageCoupons: number;
  fixedCoupons: number;
}

@Component({
  selector: 'app-mixed-widget10',
  templateUrl: './mixed-widget10.component.html',
})
export class MixedWidget10Component implements OnInit {
  metrics: CouponMetrics = {
    totalCoupons: 0,
    activeCoupons: 0,
    percentageCoupons: 0,
    fixedCoupons: 0
  };
  isLoading: any = null;
  recentCoupons: any = [];

  constructor(
    public couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.couponService.isLoading$;
    this.loadMetrics();
  }

  loadMetrics() {
    this.couponService.listCoupon(null, null).subscribe((resp: any) => {
      const allCoupons = resp.coupons.data;
      
      this.metrics.totalCoupons = allCoupons.length;
      this.metrics.activeCoupons = allCoupons.filter((coupon: any) => coupon.state === 1).length;
      this.metrics.percentageCoupons = allCoupons.filter((coupon: any) => coupon.type_discount === 1).length;
      this.metrics.fixedCoupons = allCoupons.filter((coupon: any) => coupon.type_discount === 2).length;
      
      this.recentCoupons = allCoupons.slice(0, 5);
    });
  }
}