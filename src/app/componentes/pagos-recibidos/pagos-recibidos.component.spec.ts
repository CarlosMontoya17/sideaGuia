import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosRecibidosComponent } from './pagos-recibidos.component';

describe('PagosRecibidosComponent', () => {
  let component: PagosRecibidosComponent;
  let fixture: ComponentFixture<PagosRecibidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosRecibidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosRecibidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
