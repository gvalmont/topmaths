import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LecteurDeXlsComponent } from './lecteur-de-xls.component'

describe('LecteurDeXlsComponent', () => {
  let component: LecteurDeXlsComponent
  let fixture: ComponentFixture<LecteurDeXlsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LecteurDeXlsComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(LecteurDeXlsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
