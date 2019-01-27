import React, { Component } from 'react'

import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import firebase from './firebase.js';
// import { Dialog } from '@blueprintjs/core/lib/cjs/components/dialog/dialog';

import Basic from './createBooking.tsx';

import {
    Button,
    Dialog,
} from '@blueprintjs/core';


/** Styles */
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";


export default class Calendar extends Component {

    db = firebase.firestore();

    state = {
        events: [],
        isCreateEventModalOpen: false,
    };

    componentDidMount = () => {
        this.fetchEvents();
    }

    handleSelectSlot = ({ start, end, ...rest }) => {
        console.log({
            start: moment(start).format('YYYY-MM-DDtHH:mm'),
            end: moment(end).format('YYYY-MM-DDtHH:mm'),
            title: 'newestEvent',
        })
        this.setState({
            isCreateEventModalOpen: true,
        })
        // this.addNewEventToDB({
        //     start: moment(start).format('YYYY-MM-DDtHH:mm'),
        //     end: moment(end).format('YYYY-MM-DDtHH:mm'),
        //     title: 'newestEvent',
        // })
    }

    handleCloseModal = () => {
        this.setState({
            isCreateEventModalOpen: false,
        });
    }

    fetchEvents = () => {
        this.db.collection("events")
        .onSnapshot(function(querySnapshot) {
            var events = [];
            querySnapshot.forEach(function(doc) {
                events.push(doc.data());
            });

            updateState(events);
        });

        const updateState =(events) => {
            console.log('jjj events', events)
            this.setState({
                events,
            })
        }
    }

    formatEventsForCalendar = (unformattedEvents) => {
        console.log('jjj format rawEvents', unformattedEvents)
        const formattedEvents = unformattedEvents.map(({ start, end, ...rest }) => {
            return {
                start: new Date(moment(start)),
                end: new Date(moment(end)),
                ...rest,
            }
        })
        console.log('jjj format formattedEvents', formattedEvents)
        return formattedEvents;
    }

    addNewEventToDB = (event) => {
        console.log(event, 'event to send');
        this.db.collection("events").add(event)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    onEventResize = (event) => {
        console.log(event);
    // this.setState(state => {
    //     state.events[0].start = start;
    //     state.events[0].end = end;
    //     return { events: state.events };
    // });
    };

    onEventDrop = ({ event, start, end, allDay }) => {
    console.log(start);
    };

render() {
    console.log('jjj this.state.events', this.state.events)
    const localizer = BigCalendar.momentLocalizer(moment);
    const Calendar  = withDragAndDrop(BigCalendar);

    // const Modal = <Overlay isOpen={true} />
    // const eventList = {
    //     events: [
    //     {
    //         start: new Date(),
    //         end: new Date(moment().add(1, "days")),
    //         title: "Some title",
    //     }
    //     ]
    // };
    return (
    <div>
        <Dialog
            // className={Classes.Dialog_SCROLL_CONTAINER}
            isOpen={this.state.isCreateEventModalOpen}
        >
            <div>stuffsss</div>
            <Basic />
            <Button onClick={this.handleCloseModal}> Close</Button>
        </Dialog>
        {/* <Button onClick={this.addNewEventToDB}>Add Event</Button> */}
        <Calendar
            localizer={localizer}
            events={this.formatEventsForCalendar(this.state.events)}
            onEventDrop={this.onEventDrop}
            defaultView={'week'}
            onEventResize={this.onEventResize}
            selectable
            onSelectSlot={this.handleSelectSlot}
            resizable
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100vh" }}
        />
    </div>
    )
}
}
