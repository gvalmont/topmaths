import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MathadorComponent } from './mathador.component'

describe('MathadorComponent', () => {
  let component: MathadorComponent
  let fixture: ComponentFixture<MathadorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MathadorComponent ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MathadorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
