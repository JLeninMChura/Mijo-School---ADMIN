import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { CourseService } from '../../../service/course.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clase-delete',
  templateUrl: './clase-delete.component.html',
  styleUrls: ['./clase-delete.component.scss']
})
export class ClaseDeleteComponent implements OnInit {
  @Output() ClaseD: EventEmitter<any> = new EventEmitter();
  @Input() clase_select: any = null;
  isLoading: Observable<boolean>;
  constructor(
    public modal: NgbActiveModal,
    public courseService: CourseService,
    public toaste: Toaster,
  ) { }
  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }
  delete() {
    this.courseService.deleteClase(this.clase_select.id).subscribe((resp: any) => {
      this.ClaseD.emit("")
      this.modal.dismiss()
    })
  }

}
