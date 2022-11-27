import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EvaluationsBilanComponent } from './evaluations-bilan.component'

describe('EvaluationsBilanComponent', () => {
  let component: EvaluationsBilanComponent
  let fixture: ComponentFixture<EvaluationsBilanComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluationsBilanComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(EvaluationsBilanComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
