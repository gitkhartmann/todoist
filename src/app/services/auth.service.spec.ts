import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:  [RouterTestingModule, HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return false', () => {
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should be return null', () => {
    expect(service.token).toBe(null);
  });

  it('on register should be return { idToken: string, expiresIn: string }', fakeAsync(() => {
    service.registerUser('Peter', '2@mail.ru', '123456').subscribe((value) => {
      expect(value).toBe({ idToken: 'fake-jwt-token', expiresIn: '3600' });
      flush();
    });
  }));

  it('on login should be return { idToken: string, expiresIn: string }', fakeAsync(() => {
    service.login({ email: '2@mail.ru', password: '123456' }).subscribe((value) => {
      expect(value).toBe({ idToken: 'fake-jwt-token', expiresIn: '3600' });
      flush();
    });
  }));
});
