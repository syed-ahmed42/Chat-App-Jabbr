import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";

let contactIDArr = [];
let fastContactData: any;
const Contacts = ({
  data,
  handleClick,
  deleteChatOnDatabase,
  chatID,
  stateData,
  setContactVariables,
  contactStateData,
  getContactsData,
}: any) => {
  const [contacts, setContacts]: any = useState([]);
  const curUser = data.username;
  //console.log(
  //    "This is in contacts component: " + data.listOfChats[0].members[1].username
  // );

  const connectToChatRooms = (data: any) => {
    let tempArr = [];
    for (let i = 0; i < data.listOfChats.length; i++) {
      tempArr.push(data.listOfChats[i]._id);
    }
    for (let i = 0; i < tempArr.length; i++) {
      socket.emit("join room", tempArr[i]);
    }
  };

  useEffect(() => {
    connectToChatRooms(data);
  }, [contacts]);

  const setVariables = async (username: any) => {
    fastContactData = await getContactsData(username);
    setContacts(fastContactData);
  };
  useEffect(() => {
    setContacts(contactStateData);
  }, [contactStateData]);

  console.log(contacts);

  return (
    <>
      {contacts !== undefined &&
        contacts.map((contact: any, index: any) => (
          <div key={contact.contactName}>
            <button onClick={() => handleClick(contact.id)}>
              {contact.contactName}
            </button>
            <button
              className="bg-pink-500"
              onClick={() => {
                deleteChatOnDatabase(contact.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
    </>
  );
};

export default Contacts;
