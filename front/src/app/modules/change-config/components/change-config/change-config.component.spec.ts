import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeConfigComponent } from './change-config.component';

describe('ChangeConfigComponent', () => {
  let component: ChangeConfigComponent;
  let fixture: ComponentFixture<ChangeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
