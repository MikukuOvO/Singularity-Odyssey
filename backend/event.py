import datetime
from flask import Flask, jsonify, request

events = [
    {"id": "1", "title": "Event 1", "start": datetime.datetime(2024,3,25,0,0,0), "end": datetime.datetime(2024,3,26,0,0,0), "allDay": True}
]

class event:
    def __init__(self, title:str, start_time:datetime.datetime, end_time:datetime.datetime, allDay=True):
        self.id = self.create_event_id()
        self.title = title
        self.start = start_time
        self.end = end_time
        self.allDay = allDay
        events.append(self)

    def create_event_id():
        max_id = max([int(event["id"]) for event in events]) if events else 0
        return str(max_id + 1)
    
    def add_event(self, infor):
        new_event = event(title=infor["title"], 
                            start_time=json_to_dt(infor["start"]),
                            end_time=json_to_dt(infor["end"]), 
                            allDay=infor["allDay"])
        return new_event
    
def get_events():
    return events

def json_to_dt(json):
    return datetime.dateime(json["year"], json["month"], json["day"], json["hour"], json["minute"], json["second"])