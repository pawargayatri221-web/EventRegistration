import { LightningElement, track , wire } from 'lwc';
import registerParticipant from '@salesforce/apex/EventRegistrationControllers.registerParticipant';
import getActiveEvents from '@salesforce/apex/EventHelper.getActiveEvents';

export default class EventRegistrationForm extends LightningElement { 
      
    @track eventOptions = [];
    @track selectedEvent;
    @track name = '';
    @track email = '';
    @track phone = '';
    @track message = '';

    @wire(getActiveEvents)
    wiredEvents({ data, error }) {
        if (data) {
            this.eventOptions = data.map(ev => ({
                label: `${ev.Name} (${ev.Seats_Available__c} seats left)`,
                value: ev.Id
            }));
        } else if (error) {
            console.error('Apex error:', JSON.stringify(error));
        }
    }

    handleEventChange(e) { this.selectedEvent = e.detail.value; }
    handleName(e) { this.name = e.detail.value; }
    handleEmail(e) { this.email = e.detail.value; }
    handlePhone(e) { this.phone = e.detail.value; } 


    async register() {
        if (!this.selectedEvent || !this.name || !this.email || !this.phone ) {
            this.message = '⚠️ Please fill all required fields!';
            return;
        }

        try {
            const result = await registerParticipant({
                name: this.name,
                email: this.email,
                phone: this.phone,
                eventId: this.selectedEvent
            });

            this.message = result;
            console.log('Registration result:', result);
        } catch (error) {
            console.error('Error during registration:', error);
            this.message = '❌ Registration failed. Please try again later.';
        }
    }
}

  /*  async handleRegister() {
        try {
            const result = await registerParticipant({
                name: this.name,
                email: this.email,
                phone: this.phone,
                eventId: this.selectedEvent
            });
            this.message = result;
        } catch (error) {
            this.message = 'Error: ' + error.body.message;
        }
    }
}*/
