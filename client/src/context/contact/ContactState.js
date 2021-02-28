import React, { useReducer } from 'react';
import axios from 'axios';

import ContactContext from './contactContext';
import ContactReducer from './contactReducer';
import {
    GET_CONTACTS,
    CLEAR_CONTACTS,
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACT,
    CLEAR_FILTER,
    CLEAR_CURRENT,
    CONTACT_ERROR
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        error: null
    };

    const [state, dispatch] = useReducer(ContactReducer, initialState);
    //Get contacts
    const getContacts = async () => {
        try {
            const res = await axios.get('/api/contacts');

            dispatch({
                type: GET_CONTACTS,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }

    }

    //Add contact
    const addContact = async contact => {
        const config = {
            header: {
                'Config-Type': 'application/js'
            }
        }

        try {
            const res = await axios.post('/api/contacts', contact, config);

            dispatch({
                type: ADD_CONTACT,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }

    }
    //Delete Contact
    const deleteContact = async id => {
        dispatch({
            type: DELETE_CONTACT,
            payload: id
        })
        try {
            axios.delete(`/api/contacts/${id}`);

            dispatch({
                type: DELETE_CONTACT,
                payload: id
            })
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }
    }
    //Update contact
    const updateContact = async contact => {
        const config = {
            header: {
                'Config-Type': 'application/js'
            }
        }

        try {
            const res = await axios.put(`/api/contacts/${contact._id}`, contact, config);
            dispatch({
                type: UPDATE_CONTACT,
                payload: res.data
            })

        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }


    }
    //Set Current Contact
    const setCurrent = contact => {
        dispatch({
            type: SET_CURRENT,
            payload: contact
        })
    }
    //Clear current Contact
    const clearCurrent = () => {
        dispatch({
            type: CLEAR_CURRENT
        })
    }
    //Clear contact
    const clearContacts = () => {
        dispatch({
            type: CLEAR_CONTACTS
        })
    }

    //Filter contacts
    const filterContacts = text => {
        dispatch({
            type: FILTER_CONTACT,
            payload: text
        })
    }
    //Clear filter
    const clearFilter = () => {
        dispatch({
            type: CLEAR_FILTER
        })
    }
    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                error: state.error,
                current: state.current,
                filtered: state.filtered,
                addContact,
                deleteContact,
                setCurrent,
                clearCurrent,
                updateContact,
                filterContacts,
                clearFilter,
                getContacts,
                clearContacts
            }}>
            {props.children}
        </ContactContext.Provider>
    )
}

export default ContactState;