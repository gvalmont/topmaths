import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionActuelleComponent } from './competition-actuelle.component';

describe('CompetitionActuelleComponent', () => {
  let component: CompetitionActuelleComponent;
  let fixture: ComponentFixture<CompetitionActuelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitionActuelleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionActuelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
