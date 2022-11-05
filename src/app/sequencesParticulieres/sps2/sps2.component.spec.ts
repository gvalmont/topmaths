import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Sps2Component } from './sps2.component'

describe('Sps2Component', () => {
  let component: Sps2Component
  let fixture: ComponentFixture<Sps2Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sps2Component]
    })
      .compileComponents()

    fixture = TestBed.createComponent(Sps2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
