import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesEditComponent } from '../categories-edit/categories-edit.component';
import { CategoriesDeleteComponent } from '../categories-delete/categories-delete.component';
import { CategoriesAddComponent } from '../categories-add/categories-add.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  CATEGORIES: any;
  isLoading: any = null;
  search: any = null;
  state: any = null;
  constructor(
    public modalService: NgbModal,
    public categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categoriesService.isLoading$;
    this.listCategories();
  }
  listCategories() {
    this.categoriesService
      .listCategories(this.search, this.state)
      .subscribe((resp: any) => {
        this.CATEGORIES = resp.categories.data;
      });
    
  }
  editCategory(CATEGORY: any) {
    const modalRef = this.modalService.open(CategoriesEditComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.category = CATEGORY;

    modalRef.componentInstance.CATEGORIES = this.CATEGORIES.filter(
      (category: any) => !category.category_id
    );
    modalRef.componentInstance.CategoryE.subscribe((resp: any) => {
      console.log(resp)
      let index = this.CATEGORIES.findIndex((item: any) => item.id === resp.id);
      this.CATEGORIES[index] = resp;
      window.location.reload();
    });
  }
  deleteCategory(CATEGORY: any) {
    const modalRef = this.modalService.open(CategoriesDeleteComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.category = CATEGORY;
    modalRef.componentInstance.CategoryD.subscribe((resp: any) => {
      let index = this.CATEGORIES.findIndex(
        (item: any) => item.id === CATEGORY.id
      );
      this.CATEGORIES.splice(index, 1);
      window.location.reload();
    });
  }
  openModalCreateCategory() {
    const modalRef = this.modalService.open(CategoriesAddComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.CATEGORIES = this.CATEGORIES.filter(
      (category: any) => !category.category_id
    );
    modalRef.componentInstance.CategoryA.subscribe((resp: any) => {
      this.CATEGORIES.unshift(resp);
    });
  }
  clearFilters() {
    this.search = null;
    this.state = 0;
    this.listCategories();
  }

}
