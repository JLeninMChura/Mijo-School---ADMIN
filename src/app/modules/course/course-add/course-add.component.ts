import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {
  subcategoria: any = [];
  subcategoria_back: any = [];
  categoria: any = [];
  instructor: any = [];
  FILE_PORTADA: any = null;
  IMAGEN_PREVISUALIZA: any = './assets/media/svg/brand-logos/volicity-9.svg';
  requirements: any = [];
  text_reque: any = null;
  text_what_is_for: any = null;
  what_is_for: any = [];
  isLoading: any;
  state: any = 1;
  title: any = null;
  subtitle: any = null;
  precio_usd: number = 0;
  precio_pen: number = 0;
  description: any = "<p>Sin Descripción</p>";
  category_id: any = null;
  sub_categorie_id: any = null;
  user_id: any = null;
  level: any = null;
  idioma: any = null;

  //what_is_it_for

  constructor(
    public courseService: CourseService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.listconfig().subscribe((res: any) => {
      console.log(res.categories);
      this.subcategoria = res.subcategories;
      this.categoria = res.categories;
      this.instructor = res.instructores;
    })
  }

  selectcategroy(value: any) {
    let valor = value.target.value;
    this.subcategoria_back = this.subcategoria.filter((item: any) => item.category_id == valor);
  }
  addRequi() {
    if (!this.text_reque) {
      this.toaster.open({ text: "Es necesario los requerimientos", caption: 'Validación', type: 'danger' })
      return;
    }
    this.requirements.push(this.text_reque);
  }
  addWhatisFor() {
    if (!this.text_what_is_for) {
      this.toaster.open({ text: "Necesario a las personas que va dirigia el curso", caption: 'Validación', type: 'danger' })
      return;
    }
    this.what_is_for.push(this.text_what_is_for);
  }




  removeRequeriments(index: number) {
    this.requirements.splice(index, 1);
  }
  removeWhatisFor(index: number) {
    this.what_is_for.splice(index, 1);

  }
  public onChange(event: any) {
    this.description = event.editor.getData();
  }
  save() {
    console.log(this.description);
    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("subtitle", this.subtitle);
    formData.append("precio_usd", this.precio_usd + "");
    formData.append("precio_pen", this.precio_pen + "");
    formData.append("category_id", this.category_id);
    formData.append("sub_categorie_id", this.sub_categorie_id);
    formData.append("requirements", this.requirements);
    formData.append("what_is_it_for", this.what_is_for);
    formData.append("user_id", this.user_id);
    formData.append("portada", this.FILE_PORTADA);
    formData.append("level", this.level);
    formData.append("idioma", this.idioma);
    formData.append("state", this.state);
    formData.append("description", this.description);

    this.courseService.registerCourses(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toaster.open({ text: resp.message_text, caption: 'Validación', type: 'danger' })
      } else {
        this.toaster.open({ text: "El curso se creo correctamente", caption: 'Exitoso', type: 'primary' });
        this.title = null;
        this.subtitle = null;
        this.precio_usd = 0;
        this.precio_pen = 0;
        this.category_id = null;
        this.sub_categorie_id = null;
        this.requirements = [];
        this.what_is_for = [];
        this.user_id = null;
        this.FILE_PORTADA = null;
        this.level = null;
        this.idioma = null;
        this.description = null;
        this.IMAGEN_PREVISUALIZA = './assets/media/svg/brand-logos/volicity-9.svg';
      }
    });
  }
  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toaster.open({
        text: 'Solo se aceptan imagenes',
        caption: 'Mensaje de validacón',
        type: 'danger',
      });
      return;
    }
    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => (this.IMAGEN_PREVISUALIZA = reader.result);
    this.courseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.courseService.isLoadingSubject.next(false);
    }, 50);
  }
}
