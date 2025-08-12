import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPrepareDialog } from './room-prepare-dialog'

describe('RoomPrepareDialog', () => {
  let component: RoomPrepareDialog;
  let fixture: ComponentFixture<RoomPrepareDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomPrepareDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPrepareDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
