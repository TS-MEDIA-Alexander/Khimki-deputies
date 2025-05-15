import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Contacts {
   title: string;
   phone: string;
   address: string;
   text: string;
   email: string;
}

interface ContactsPayload {
   title: '',
   phone: '',
   address: '',
   text: '',
   email: ''
}

const initialState: Contacts = {
   title: '',
   phone: '',
   address: '',
   text: '',
   email: ''
}

export const contactsSlice = createSlice({
   name: 'contacts',
   initialState,
   reducers: {
      setContacts: (state: Contacts, action: PayloadAction<ContactsPayload>) => {
         state.title = action.payload.title;
         state.phone = action.payload.phone;
         state.address = action.payload.address;
         state.text = action.payload.text;
         state.email = action.payload.email;
      },
   },
});

export const { setContacts } = contactsSlice.actions;
export default contactsSlice.reducer;