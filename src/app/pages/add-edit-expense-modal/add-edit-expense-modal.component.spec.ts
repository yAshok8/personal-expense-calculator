import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExpenseModalComponent } from './add-edit-expense-modal.component';

describe('AddExpenseModalComponent', () => {
  let component: AddEditExpenseModalComponent;
  let fixture: ComponentFixture<AddEditExpenseModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditExpenseModalComponent]
    });
    fixture = TestBed.createComponent(AddEditExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
