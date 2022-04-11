import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialSideaComponent } from './historial-sidea.component';

describe('HistorialSideaComponent', () => {
  let component: HistorialSideaComponent;
  let fixture: ComponentFixture<HistorialSideaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialSideaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialSideaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
