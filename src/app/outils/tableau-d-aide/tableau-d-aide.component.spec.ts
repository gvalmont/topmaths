import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TableauDAideComponent } from './tableau-d-aide.component'

describe('TableauDAideComponent', () => {
  let component: TableauDAideComponent
  let fixture: ComponentFixture<TableauDAideComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableauDAideComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(TableauDAideComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
