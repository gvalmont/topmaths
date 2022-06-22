import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModaleExercicesComponent } from './modale-exercices.component'

describe('ModaleExercicesComponent', () => {
  let component: ModaleExercicesComponent
  let fixture: ComponentFixture<ModaleExercicesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaleExercicesComponent ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleExercicesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
