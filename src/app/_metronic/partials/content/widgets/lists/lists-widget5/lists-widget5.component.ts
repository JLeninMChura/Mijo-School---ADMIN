// mixed-widget5.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/modules/categories/service/categories.service';

interface Category {
  id: number;
  name: string;
  imagen: string;
  category_id: number | null;
  state: number;
}

interface CategoryMetrics {
  totalCategories: number;
  totalSubCategories: number;
  activeCategories: number;
}
@Component({
  selector: 'app-lists-widget5',
  templateUrl: './lists-widget5.component.html',
})
export class ListsWidget5Component implements OnInit{
  metrics: CategoryMetrics = {
    totalCategories: 0,
    totalSubCategories: 0,
    activeCategories: 0
  };
  isLoading: any = null;
  recentCategories: Category[] = [];

  constructor(
    public categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.categoriesService.isLoading$;
    this.loadMetrics();
  }

  loadMetrics() {
    this.categoriesService.listCategories(null, null).subscribe((resp: any) => {
      const allCategories: Category[] = resp.categories.data;
      
      this.metrics.totalCategories = allCategories.filter((cat: Category) => !cat.category_id).length;
      this.metrics.totalSubCategories = allCategories.filter((cat: Category) => cat.category_id).length;
      this.metrics.activeCategories = allCategories.filter((cat: Category) => cat.state === 1).length;
      
      this.recentCategories = allCategories.slice(0, 5);
    });
  }
}
