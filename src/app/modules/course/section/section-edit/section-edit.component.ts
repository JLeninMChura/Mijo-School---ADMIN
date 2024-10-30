import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../../service/course.service';

@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrls: ['./section-edit.component.scss']
})
export class SectionEditComponent implements OnInit {
  @Input() seccion_selected: any;
  @Output() SectionE:EventEmitter<any> = new EventEmitter();
  section_name: any = null;
  state: any = null;
  constructor(
    public modal: NgbActiveModal,
    public courseServeice: CourseService
  ) { }

  ngOnInit(): void {
    this.section_name = this.seccion_selected.name;
    this.state = this.seccion_selected.state;
    console.log(this.seccion_selected)
  }

  store(){
    let data ={
      name: this.section_name,
      state: this.state,
    }
    this.courseServeice.updateSection(data, this.seccion_selected.id).subscribe((resp:any)=>{
      console.log(resp);
      this.SectionE.emit(resp.sections)
      this.modal.close();
    })
  }
}
