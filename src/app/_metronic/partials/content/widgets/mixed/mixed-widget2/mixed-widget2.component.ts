// mixed-widget2.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/modules/course/service/course.service';

interface Course {
  id: number;
  title: string;
  subtitle: string;
  imagen: string;
  state: number;
  precio_usd: number;
  user?: {
    name: string;
    surname: string;
  }
}

interface Metrics {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
}

@Component({
  selector: 'app-mixed-widget2',
  templateUrl: './mixed-widget2.component.html',
})
export class MixedWidget2Component implements OnInit {
  metrics: Metrics = {
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
  };
  isLoading: any = null;
  recentCourses: Course[] = [];

  constructor(
    public courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.loadMetrics();
  }

  loadMetrics() {
    // Pasamos null para ambos parámetros ya que queremos todos los cursos
    this.courseService.listCourses(null, null).subscribe((resp: any) => {
      const allCourses: Course[] = resp.courses.data;
      
      this.metrics.totalCourses = allCourses.length;
      this.metrics.publishedCourses = allCourses.filter((course: Course) => course.state === 2).length;
      this.metrics.draftCourses = allCourses.filter((course: Course) => course.state === 1).length;
      
      // Obtener los 5 cursos más recientes
      this.recentCourses = allCourses.slice(0, 5);
    });
  }

  getAveragePrice(): string {
    if (this.recentCourses.length === 0) return '0';
    const total = this.recentCourses.reduce((sum: number, course: Course) => sum + course.precio_usd, 0);
    return (total / this.recentCourses.length).toFixed(2);
  }
}