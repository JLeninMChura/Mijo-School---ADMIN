import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../../../service/course.service';
import { Toaster } from 'ngx-toast-notifications';
import { DomSanitizer } from '@angular/platform-browser';
import { ClaseFileDeleteComponent } from '../clase-file-delete/clase-file-delete.component';
import { findIndex } from 'rxjs';

@Component({
  selector: 'app-clase-edit',
  templateUrl: './clase-edit.component.html',
  styleUrls: ['./clase-edit.component.scss']
})
export class ClaseEditComponent implements OnInit {
  @Input() clase_select: any;
  @Output() ClaseE: EventEmitter<any> = new EventEmitter();
  title: any;
  description: any;
  FILES: any = [];
  FILES_CLASE: any = [];
  isLoading: any;
  video_curso: any = null;
  isUploadVideo: Boolean = false;
  link_video_clase: any = null
  isUploadFile: any = false;
  state:any = 1;
  constructor(
    public modal: NgbActiveModal,
    public courseservice: CourseService,
    public toaster: Toaster,
    public sanitizer: DomSanitizer,
    public modaleli: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseservice.isLoading$;
    this.title = this.clase_select.name;
    this.description = this.clase_select.description;
    this.FILES_CLASE = this.clase_select.files;
    this.link_video_clase = this.clase_select.vimeo_id;
    this.state = this.clase_select.state;
  }
  store() {
    let data = {
      name: this.title,
      description: this.description,
      state: this.state
    }
    this.courseservice.updateClase(data, this.clase_select.id).subscribe((resp: any) => {
      this.toaster.open({ text: "Se ha actualizado correctamente la clase", caption: "Exitoso", type: "primary" });
      this.modal.close();
      this.ClaseE.emit(resp.clase)
    })
  }
  public onChange(event: any) {
    this.description = event.editor.getData();
  }
  processFile($event: any) {
    for (const file of $event.target.files) {
      this.FILES.push(file)

    }
    console.log(this.FILES);
  }
  deletefilr(file: any) {
    const modalref = this.modaleli.open(ClaseFileDeleteComponent, { centered: true, size: "md" });
    modalref.componentInstance.file_select = file;
    modalref.componentInstance.FileD.subscribe((resp: any) => {
      let INDEX =this.FILES_CLASE.findIndex((item: any) => item.id == file.id);
      this.FILES_CLASE.splice(INDEX,1)
    })
  }
  uploadVideo() {
    let formData = new FormData();
    formData.append("video", this.video_curso);
    this.isUploadVideo = true;
    this.courseservice.uploadVideoClase(formData, this.clase_select.id).subscribe((resp: any) => {
      this.isUploadVideo = false;
      console.log(resp);
      this.link_video_clase = resp.link_video
    })
  }
  urlVideo() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_video_clase);
  }
  processVideo($event: any) {
    if ($event.target.files[0].type.indexOf("video") < 0) {
      this.toaster.open({
        text: 'Solo se aceptan Videos',
        caption: 'Mensaje de validacón',
        type: 'danger',
      });
    }
    this.video_curso = $event.target.files[0];
  }
  uploadFiles() {
    let formData = new FormData();
    formData.append("course_clase_id", this.clase_select.id)
    this.FILES.forEach((file: any, index: number) => {
      formData.append("files[" + index + "]", file);
    });
    this.isUploadFile = true;
    this.courseservice.registerClaseFile(formData).subscribe(((resp: any) => {
      console.log(resp)
      this.isUploadFile = false;
      this.modal.close();
      this.ClaseE.emit(resp.clase);
    }))
  }
}
