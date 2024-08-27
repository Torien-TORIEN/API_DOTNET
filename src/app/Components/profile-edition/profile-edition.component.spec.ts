import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditionComponent } from './profile-edition.component';

describe('ProfileEditionComponent', () => {
  let component: ProfileEditionComponent;
  let fixture: ComponentFixture<ProfileEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
