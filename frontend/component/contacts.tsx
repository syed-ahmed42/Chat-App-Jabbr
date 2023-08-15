import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";
import "../styles/contactStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

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
  handleLogOut,
}: any) => {
  const [contacts, setContacts]: any = useState([]);
  const [active, setActive] = useState("");
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

  const setActiveOnClick = (keyID: any) => {
    setActive(keyID);
  };

  useEffect(() => {
    setContacts(contactStateData);
  }, [contactStateData]);

  //console.log(contacts);

  return (
    <div className="h-full contactContainer">
      <div className="contactNameButtonContainersHolder h-full">
        {contacts !== undefined &&
          contacts.map((contact: any, index: any) => (
            <div
              className="contactNameButtonContainer h-full"
              key={contact.contactName}
            >
              <button
                className={
                  active === contact.contactName
                    ? "contactNameButton contactNameButtonActive"
                    : "contactNameButton"
                }
                onClick={() => {
                  handleClick(contact.id);
                  setActiveOnClick(contact.contactName);
                }}
              >
                {contact.contactName}
              </button>
              <button
                className="deleteButton"
                onClick={() => {
                  deleteChatOnDatabase(contact.id);
                }}
              >
                <FontAwesomeIcon className="deleteButtonIcon" icon={faX} />
              </button>
            </div>
          ))}
      </div>
      <div className="profileInformationContainer">
        <div className="profileInfo">
          <div>Signed in as</div>
          <div>{data.username}</div>
        </div>
        <div className="logoutButtonHolder">
          <button className="logoutButton" onClick={() => handleLogOut()}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
