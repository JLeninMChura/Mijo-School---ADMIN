import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { CourseService } from '../service/course.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-course-delete',
  templateUrl: './course-delete.component.html',
  styleUrls: ['./course-delete.component.scss']
})
export class CourseDeleteComponent implements OnInit {
  @Output() CourseD: EventEmitter<any> = new EventEmitter();
  @Input() COURSES: any = null;
  @Input() course: any = null;
  isLoading: Observable<boolean>;
  constructor(
    public modal: NgbActiveModal,
    public courseService: CourseService,
    public toaste: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }
  delete(){
    this.courseService.deleteCourses(this.course.id).subscribe((resp:any)=>{
      this.CourseD.emit("")
      this.modal.dismiss()
    })
  }

}
