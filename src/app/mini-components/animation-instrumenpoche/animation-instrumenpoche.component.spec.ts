import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AnimationInstrumenpocheComponent } from './animation-instrumenpoche.component'

describe('AnimationInstrumenpocheComponent', () => {
  let component: AnimationInstrumenpocheComponent
  let fixture: ComponentFixture<AnimationInstrumenpocheComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimationInstrumenpocheComponent]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationInstrumenpocheComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
