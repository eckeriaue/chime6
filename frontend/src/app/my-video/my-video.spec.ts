import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVideo } from './my-video';

describe('MyVideo', () => {
  let component: MyVideo;
  let fixture: ComponentFixture<MyVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
