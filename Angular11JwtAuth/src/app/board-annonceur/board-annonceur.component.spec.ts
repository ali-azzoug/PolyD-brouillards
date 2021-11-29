import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAnnonceurComponent } from './board-annonceur.component';

describe('BoardAnnonceurComponent', () => {
  let component: BoardAnnonceurComponent;
  let fixture: ComponentFixture<BoardAnnonceurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardAnnonceurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardAnnonceurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
