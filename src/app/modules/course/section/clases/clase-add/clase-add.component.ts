import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../service/course.service';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaseEditComponent } from '../clase-edit/clase-edit.component';
import { ClaseDeleteComponent } from '../clase-delete/clase-delete.component';

@Component({
  selector: 'app-clase-add',
  templateUrl: './clase-add.component.html',
  styleUrls: ['./clase-add.component.scss']
})
export class ClaseAddComponent implements OnInit {
  isLoading: any;
  CLASES: any = [];
  title: any = [];
  description: any = "<p>Sin Descripción</p>";
  FILES: any = [];
  section_id: any;
  constructor(
    public activeRouter: ActivatedRoute,
    public courseService: CourseService,
    public toaster: Toaster,
    public modal: NgbModal
  ) {
    this.isLoading = this.courseService.isLoading$;
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((resp: any) => {
      console.log(resp);
      this.section_id = resp.id
    })
    this.isLoading = this.courseService.isLoading$;
    this.courseService.listClase(this.section_id).subscribe((resp: any) => {
      console.log(resp);
      this.CLASES = resp.clases.data
    })
  }
  public onChange(event: any) {
    this.description = event.editor.getData();
  }
  save() {
    if (!this.title ||
      !this.description) {
      this.toaster.open({ text: 'Los Campos son obligatorios', caption: 'Mensaje de validacón', type: 'danger' });
      return;
    }
    let formData = new FormData();
    formData.append("name", this.title);
    formData.append("description", this.description);
    formData.append("course_section_id", this.section_id);
    formData.append("state", "1");
    this.FILES.forEach((file: any, index: number) => {
      formData.append("files[" + index + "]", file);
    });
    this.courseService.registerClase(formData).subscribe((resp: any) => {
      console.log(resp);
      this.toaster.open({ text: 'La clase se creo con exito', caption: 'Exitoso', type: 'primary' });
      this.CLASES.push(resp.clase);
      this.title= null;
      this.description=null;
      this.FILES = []

    })
  }

  editClases(section: any) {
    const modalref = this.modal.open(ClaseEditComponent, { centered: true, size: "md" });
    modalref.componentInstance.clase_select = section;
    modalref.componentInstance.ClaseE.subscribe((resp:any)=>{
      let INDEX = this.CLASES.findIndex((item:any)=> item.id=resp.id);
      this.CLASES[INDEX] = resp;
    })
  }
  deleteClases(section: any) {
    const modalref = this.modal.open(ClaseDeleteComponent, { centered: true, size: "md" });
    modalref.componentInstance.clase_select = section;
    modalref.componentInstance.ClaseD.subscribe((resp: any) => {
      let INDEX =this.CLASES.findIndex((item: any) => item.id == section.id);
      this.CLASES.splice(INDEX,1)
    })
  }
  processFile($event: any) {
    for (const file of $event.target.files) {
      this.FILES.push(file)

    }
    console.log(this.FILES);
  }
}
