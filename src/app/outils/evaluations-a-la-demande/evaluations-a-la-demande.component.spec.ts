import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EvaluationsALaDemandeComponent } from './evaluations-a-la-demande.component'

describe('EvaluationsALaDemandeComponent', () => {
  let component: EvaluationsALaDemandeComponent
  let fixture: ComponentFixture<EvaluationsALaDemandeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluationsALaDemandeComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(EvaluationsALaDemandeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
