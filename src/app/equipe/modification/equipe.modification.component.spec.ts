import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeModificationComponent } from './equipe.modification.component';

describe('EquipeModificationComponent', () => {
  let component: EquipeModificationComponent;
  let fixture: ComponentFixture<EquipeModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipeModificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipeModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
