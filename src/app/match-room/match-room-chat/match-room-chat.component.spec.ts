import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MatchRoomChatComponent} from './match-room-chat.component';

describe('MatchRoomChatComponent', () => {
  let component: MatchRoomChatComponent;
  let fixture: ComponentFixture<MatchRoomChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchRoomChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchRoomChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
