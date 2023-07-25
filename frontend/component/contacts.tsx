import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";

let contactIDArr = [];
const Contacts = ({ data, handleClick }: any) => {
  const [contacts, setContacts] = useState([""]);
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
          tempArr.push(data.listOfChats[i].members[j].username);
        }
      }
    }
    setContacts(tempArr);
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
      {contacts.map((contact) => (
        <button key={contact} onClick={() => handleClick({ contact })}>
          {contact}
        </button>
      ))}
    </>
  );
};

export default Contacts;
