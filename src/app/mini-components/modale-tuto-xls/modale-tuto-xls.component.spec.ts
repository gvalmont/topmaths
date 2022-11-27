import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModaleTutoXlsComponent } from './modale-tuto-xls.component'

describe('ModaleTutoXlsComponent', () => {
  let component: ModaleTutoXlsComponent
  let fixture: ComponentFixture<ModaleTutoXlsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModaleTutoXlsComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ModaleTutoXlsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
