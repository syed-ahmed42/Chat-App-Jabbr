import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";

let contactIDArr = [];
const Contacts = ({ data, handleClick, deleteChatOnDatabase }: any) => {
  const [contacts, setContacts]: any = useState([]);
  const curUser = data.username;
  //console.log(
  //    "This is in contacts component: " + data.listOfChats[0].members[1].username
  // );
  const populateContacts = async (data: any) => {
    let tempArr = [];
    for (let i = 0; i < data.listOfChats.length; i++) {
      for (let j = 0; j < data.listOfChats[i].members.length; j++) {
        if (data.listOfChats[i].members[j].username !== data.username) {
          console.log(data.listOfChats[i].members[j]);
          tempArr.push({
            contactName: data.listOfChats[i].members[j].username,
            id: data.listOfChats[i]._id,
          });
        }
      }
    }
    setContacts(tempArr);
  };

  const deleteChatOnClientSide = (index: any) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

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
  }, []);

  useEffect(() => {
    populateContacts(data);
  }, [data]);

  console.log(contacts);

  return (
    <>
      {contacts.map((contact: any, index: any) => (
        <div key={index}>
          <button onClick={() => handleClick(contact.contactName)}>
            {contact.contactName}
          </button>
          <button
            className="bg-pink-500"
            onClick={() => {
              deleteChatOnDatabase(contact.id);
              deleteChatOnClientSide(index);
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
