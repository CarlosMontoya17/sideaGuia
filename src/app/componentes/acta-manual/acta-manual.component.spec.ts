import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaManualComponent } from './acta-manual.component';

describe('ActaManualComponent', () => {
  let component: ActaManualComponent;
  let fixture: ComponentFixture<ActaManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActaManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActaManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
