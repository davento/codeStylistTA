import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInputComponent } from './change-input.component';

describe('ChangeInputComponent', () => {
  let component: ChangeInputComponent;
  let fixture: ComponentFixture<ChangeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
