import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSkillComponent } from './client-skill.component';

describe('ClientSkillComponent', () => {
  let component: ClientSkillComponent;
  let fixture: ComponentFixture<ClientSkillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientSkillComponent]
    });
    fixture = TestBed.createComponent(ClientSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
