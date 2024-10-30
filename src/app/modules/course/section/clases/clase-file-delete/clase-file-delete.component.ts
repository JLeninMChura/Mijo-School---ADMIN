import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CourseService } from '../../../service/course.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-clase-file-delete',
  templateUrl: './clase-file-delete.component.html',
  styleUrls: ['./clase-file-delete.component.scss']
})
export class ClaseFileDeleteComponent implements OnInit {
  @Output() FileD: EventEmitter<any> = new EventEmitter();
  @Input() file_select: any = null;
  isLoading: Observable<boolean>;
  constructor(
    public modal: NgbActiveModal,
    public courseService: CourseService,
    public toaste: Toaster,
  ) { }
  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    console.log(this.file_select)
  }
  delete() {
    this.courseService.deleteClaseFile(this.file_select.id).subscribe((resp: any) => {
      this.FileD.emit("")
      this.modal.dismiss()
    })
  }

}
