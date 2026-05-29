from typing import Dict, List, Any
from sqlalchemy.orm import Session
from app.observers.base_observer import EventObserver

class EventPublisher:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(EventPublisher, cls).__new__(cls, *args, **kwargs)
            cls._instance._observers = {}
        return cls._instance

    def subscribe(self, event: str, observer: EventObserver) -> None:
        if event not in self._observers:
            self._observers[event] = []
        if observer not in self._observers[event]:
            self._observers[event].append(observer)

    def unsubscribe(self, event: str, observer: EventObserver) -> None:
        if event in self._observers and observer in self._observers[event]:
            self._observers[event].remove(observer)

    def publish(self, db: Session, event: str, data: Dict[str, Any]) -> None:
        if event in self._observers:
            for observer in self._observers[event]:
                try:
                    observer.update(db, event, data)
                except Exception as e:
                    print(f"[EventPublisher] Error in observer {observer.__class__.__name__} for event '{event}': {e}")

event_publisher = EventPublisher()
