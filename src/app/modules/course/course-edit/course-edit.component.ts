import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { Toaster } from 'ngx-toast-notifications';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {
  subcategoria: any = [];
  subcategoria_back: any = [];
  categoria: any = [];
  instructor: any = [];
  FILE_PORTADA: any = null;
  IMAGEN_PREVISUALIZA: any = './assets/media/svg/brand-logos/volicity-9.svg';
  requirements: any = [];
  text_reque: any = null;
  text_what_is_for: string = '';
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
  course_id: any;
  course_selected: any = null;
  video_curso: any = null;
  isUploadVideo: boolean = false;
  link_video_course: any = null;
  //what_is_it_for

  constructor(
    public courseService: CourseService,
    public toaster: Toaster,
    public activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.listconfig().subscribe((res: any) => {
      this.subcategoria = res.subcategories;
      this.categoria = res.categories;
      this.instructor = res.instructores;
      this.showCourse(this.course_id);

    })

    this.activatedRoute.params.subscribe((resp: any) => {
      this.course_id = resp.id;
    })
  }
  showCourse(course_id: string) {
    this.courseService.showCourse(course_id).subscribe((resp: any) => {
      this.course_selected = resp.course;
      console.log(this.course_selected)
      this.title = this.course_selected.title;
      this.subtitle = this.course_selected.subtitle;
      this.precio_usd = this.course_selected.precio_usd;
      this.precio_pen = this.course_selected.precio_pen;
      this.category_id = this.course_selected.category_id;
      this.selectcategroy({ target: { value: this.category_id } });
      this.sub_categorie_id = this.course_selected.sub_categorie.id;
      this.requirements = this.course_selected.requirements;
      this.what_is_for = this.course_selected.what_is_it_for;
      this.user_id = this.course_selected.user_id;
      this.level = this.course_selected.level;
      this.idioma = this.course_selected.idioma;
      this.description = this.course_selected.description;
      this.state = this.course_selected.state;
      this.IMAGEN_PREVISUALIZA = this.course_selected.imagen;
      if (this.course_selected.vimeo_id) {
        this.link_video_course = "https://player.vimeo.com/video/" + this.course_selected.vimeo_id;
      };

    });
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
      this.toaster.open({ text: "Necesario a quienes va dirigido", caption: 'Validación', type: 'danger' });
      return;
    }

    // Comprobación de nulidad antes de llamar a push()
    if (!this.what_is_for) {
      this.what_is_for = []; // Inicializa this.what_is_for como un arreglo vacío si aún no está definido
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

    this.courseService.updateCourses(formData, this.course_id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toaster.open({ text: resp.message_text, caption: 'Validación', type: 'danger' })
      } else {
        this.toaster.open({ text: "El curso se a modificado con exito", caption: 'Exitoso', type: 'primary' });
        return;
      }
    });
  }
  uploadVideo() {
    let formData = new FormData();
    formData.append("video", this.video_curso);
    this.isUploadVideo = true;
    this.courseService.uploadVideo(formData, this.course_id).subscribe((resp: any) => {
      this.isUploadVideo = false;
      console.log(resp);
      this.link_video_course = resp.link_video
    })
  }
  urlVideo(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_video_course);
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
