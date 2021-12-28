import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranquilleComponent } from './tranquille.component';

describe('TranquilleComponent', () => {
  let component: TranquilleComponent;
  let fixture: ComponentFixture<TranquilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranquilleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranquilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
