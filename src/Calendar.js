import React, { Component } from 'react';

import * as _ from 'lodash';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import firebase from './firebase.js';
// import { Dialog } from '@blueprintjs/core/lib/cjs/components/dialog/dialog';

import { resourceMap } from './constants.ts';

import CreateBooking from './createBooking.tsx';

import { Button, Dialog } from '@blueprintjs/core';

/** Styles */
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default class Calendar extends Component {
  db = firebase.firestore();

  state = {
    events: [],
    isCreateEventModalOpen: false,
  };

  componentDidMount = () => {
    this.fetchEvents();
  };

  handleSelectSlot = ({ start, end, resourceId, ...rest }) => {
    console.log('jjj rest', rest);
    this.setState({
      isCreateEventModalOpen: true,
      pendingEvent: {
        start: moment(start).format('YYYY-MM-DDtHH:mm'),
        end: moment(end).format('YYYY-MM-DDtHH:mm'),
        resourceId,
      },
    });
    // this.addNewEventToDB({
    //     start: moment(start).format('YYYY-MM-DDtHH:mm'),
    //     end: moment(end).format('YYYY-MM-DDtHH:mm'),
    //     title: 'newestEvent',
    // })
  };

  handleCloseModal = () => {
    this.setState({
      isCreateEventModalOpen: false,
    });
  };

  handleSubmitBooking = (values) => {
    this.setState(
      (currentState) => ({
        ...currentState,
        pendingEvent: {
          ...currentState.pendingEvent,
          ...values,
        },
      }),
      () => {
        this.addNewEventToDB(this.state.pendingEvent);
      },
    );
  };

  fetchEvents = () => {
    this.db.collection('events').onSnapshot(function(querySnapshot) {
      var events = [];
      querySnapshot.forEach(function(doc) {
        events.push({ ...doc.data(), id: doc.id });
      });

      updateState(events);
    });

    const updateState = (events) => {
      console.log('jjj events', events);
      this.setState({
        events,
      });
    };
  };

  formatEventsForCalendar = (unformattedEvents) => {
    console.log('jjj format rawEvents', unformattedEvents);
    const formattedEvents = unformattedEvents.map(({ start, end, ...rest }) => {
      return {
        start: new Date(moment(start)),
        end: new Date(moment(end)),
        ...rest,
      };
    });
    console.log('jjj format formattedEvents', formattedEvents);
    return formattedEvents;
  };

  addNewEventToDB = (event) => {
    // return;
    this.db
      .collection('events')
      .add(event)
      .then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
  };

  onEventResize = ({ start, end, event }) => {
    console.log(event);
    this.db
      .collection('events')
      .doc(event.id)
      .update({
        start: moment(start).format('YYYY-MM-DDtHH:mm'),
        end: moment(end).format('YYYY-MM-DDtHH:mm'),
        resourceId: event.resourceId,
      });
    // this.setState(state => {
    //     state.events[0].start = start;
    //     state.events[0].end = end;
    //     return { events: state.events };
    // });
  };

  onEventDrop = ({ event, start, end, allDay }) => {
    console.log(start);
  };

  mockPlayers = [
    {
      name: 'Peter Lockie',
      id: 1,
    },
    {
      name: 'Jamie Lockie',
      id: 2,
    },
  ];

  render() {
    console.log('jjj this.state.events', this.state.events);
    const localizer = BigCalendar.momentLocalizer(moment);
    const Calendar = withDragAndDrop(BigCalendar);

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
          canEscapeKeyClose
          canOutsideClickClose
        >
          <div>stuffsss</div>
          <CreateBooking
            players={this.mockPlayers}
            onSubmitBooking={this.handleSubmitBooking}
          />
          <Button onClick={this.handleCloseModal}> Close</Button>
        </Dialog>
        {/* <Button onClick={this.addNewEventToDB}>Add Event</Button> */}
        <Calendar
          localizer={localizer}
          events={this.formatEventsForCalendar(this.state.events)}
          onEventDrop={this.onEventResize}
          views={['day', 'agenda']}
          defaultView={'day'}
          onEventResize={this.onEventResize}
          selectable
          onSelectSlot={this.handleSelectSlot}
          resizable
          resources={resourceMap}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100vh' }}
        />
      </div>
    );
  }
}
