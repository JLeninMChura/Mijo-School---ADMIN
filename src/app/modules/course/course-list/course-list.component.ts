import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { CourseDeleteComponent } from '../course-delete/course-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  COURSES: any = [];
  isLoading: any;
  search: any = null;
  state: any = null;
  constructor(
    public courseService: CourseService,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.listCourses();
  }
  listCourses() {
    this.courseService.listCourses(this.search, this.state).subscribe((resp: any) => {
      console.log(resp);
      this.COURSES = resp.courses.data
    });

  }
  clearFilters() { }
  deleteCourse(course: any) {
    const modalRef = this.modalService.open(CourseDeleteComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.course = course;
    modalRef.componentInstance.CourseD.subscribe((resp: any) => {
      let index = this.COURSES.findIndex(
        (item: any) => item.id === course.id
      );
      this.COURSES.splice(index, 1);
    });
  }
}
