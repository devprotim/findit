import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated$!: Observable<boolean>;
  currentUser$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated;
    this.currentUser$ = this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout();
  }

  isEmployer(): boolean {
    return this.authService.isEmployer();
  }

  isJobSeeker(): boolean {
    return this.authService.isJobSeeker();
  }
}
