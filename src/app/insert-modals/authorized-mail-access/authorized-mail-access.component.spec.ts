import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedMailAccessComponent } from './authorized-mail-access.component';

describe('AuthorizedMailAccessComponent', () => {
  let component: AuthorizedMailAccessComponent;
  let fixture: ComponentFixture<AuthorizedMailAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizedMailAccessComponent]
    });
    fixture = TestBed.createComponent(AuthorizedMailAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
