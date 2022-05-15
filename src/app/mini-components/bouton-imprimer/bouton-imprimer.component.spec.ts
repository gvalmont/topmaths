import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutonImprimerComponent } from './bouton-imprimer.component';

describe('BoutonImprimerComponent', () => {
  let component: BoutonImprimerComponent;
  let fixture: ComponentFixture<BoutonImprimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoutonImprimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoutonImprimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
