import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultExpenseComponent } from './default-expense.component';

describe('DefaultExpenseComponent', () => {
  let component: DefaultExpenseComponent;
  let fixture: ComponentFixture<DefaultExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultExpenseComponent]
    });
    fixture = TestBed.createComponent(DefaultExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
