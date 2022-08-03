import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutonDropdownSimpleComponent } from './bouton-dropdown-simple.component';

describe('BoutonDropdownSimpleComponent', () => {
  let component: BoutonDropdownSimpleComponent;
  let fixture: ComponentFixture<BoutonDropdownSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoutonDropdownSimpleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutonDropdownSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
