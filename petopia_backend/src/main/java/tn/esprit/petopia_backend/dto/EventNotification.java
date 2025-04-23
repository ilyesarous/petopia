package tn.esprit.petopia_backend.dto;

import lombok.Data;

import java.util.Date;
@Data
public class EventNotification {
    private String nameEvent;
    private Date timestamp;

    public EventNotification(String nameEvent, Date timestamp) {
        this.nameEvent = nameEvent;
        this.timestamp = timestamp;
    }

    public EventNotification() {
    }

    public String getNameEvent() {
        return nameEvent;
    }

    public void setNameEvent(String nameEvent) {
        this.nameEvent = nameEvent;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
