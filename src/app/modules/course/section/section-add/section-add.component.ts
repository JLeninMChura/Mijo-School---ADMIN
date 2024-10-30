import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionEditComponent } from '../section-edit/section-edit.component';
import { SectionDeleteComponent } from '../section-delete/section-delete.component';

@Component({
  selector: 'app-section-add',
  templateUrl: './section-add.component.html',
  styleUrls: ['./section-add.component.scss']
})
export class SectionAddComponent implements OnInit {
  course_id: any;
  isLoading: any;
  seccion_name: any;
  SECTIONS: any = [];

  constructor(
    public courseService: CourseService,
    public activedRouer: ActivatedRoute,
    public toaster: Toaster,
    public modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.activedRouer.params.subscribe((resp: any) => {
      console.log(resp);
      this.course_id = resp.id;
    })
    this.courseService.listSection(this.course_id).subscribe((resp: any) => {
      console.log(resp);
      this.SECTIONS = resp.sections;
    })
  }
  save() {
    if (!this.seccion_name) {
      return this.toaster.open({ text: "Falta el Nombre de sección", type: "danger", caption: "Validación" });
    }
    let data = {
      name: this.seccion_name,
      course_id: this.course_id,
      state: 1
    }
    this.courseService.registerSection(data).subscribe((resp: any) => {
      console.log(resp)
      this.seccion_name = null;
      this.SECTIONS.push(resp.sections);
      return this.toaster.open({ text: "Sección se creo exitosamente", type: "primary", caption: "Exitoso" });
    })
  }
  editSection(section: any) {
    const modalref = this.modal.open(SectionEditComponent, { centered: true, size: 'md' });
    modalref.componentInstance.seccion_selected = section;

    modalref.componentInstance.SectionE.subscribe((resp: any) => {
      let INDEX = this.SECTIONS.findIndex(((item: any) => item.id == resp.id));
      if (INDEX != -1) {
        this.SECTIONS[INDEX] = resp;
      }
    })
  }

  deleteSection(section:any){
    const modalref = this.modal.open(SectionDeleteComponent, { centered: true, size: 'md' });
    modalref.componentInstance.seccion_selected = section;

    modalref.componentInstance.SectionD.subscribe((resp: any) => {
      let INDEX = this.SECTIONS.findIndex(((item: any) => item.id == section.id));
      if (INDEX != -1) {
        this.SECTIONS.splice(INDEX, 1);
      }
    })
  }
}
