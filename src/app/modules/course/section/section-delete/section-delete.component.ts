import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CourseService } from '../../service/course.service';

@Component({
  selector: 'app-section-delete',
  templateUrl: './section-delete.component.html',
  styleUrls: ['./section-delete.component.scss']
})
export class SectionDeleteComponent implements OnInit {
  @Input() seccion_selected: any;
  @Output() SectionD: EventEmitter<any> = new EventEmitter();
  constructor(
    public modal: NgbActiveModal,
    public toates: Toaster,
    public courseService: CourseService
  ) { }

  ngOnInit(): void {
  }
  delete() {
    this.courseService.deleteSection(this.seccion_selected.id).subscribe((resp: any) => {
      if (resp.message == 403) {
        return this.toates.open({ text: resp.message_text, type: "danger", caption: "Validación" });
        return;
      } else {
        this.SectionD.emit("");
        this.modal.close()
      }
    })
  }

}
