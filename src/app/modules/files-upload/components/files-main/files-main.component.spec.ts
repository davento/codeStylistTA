import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesMainComponent } from './files-main.component';

describe('FilesMainComponent', () => {
  let component: FilesMainComponent;
  let fixture: ComponentFixture<FilesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
