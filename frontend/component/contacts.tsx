import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Contacts = ({ data }: any) => {
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

  useEffect(() => {
    populateContacts(data);
  }, []);

  console.log(contacts);

  return (
    <>
      {contacts.map((contact) => (
        <ul key={contact}>{contact}</ul>
      ))}
    </>
  );
};

export default Contacts;
