import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStateContext } from "../../context/StateContext";
import { database } from "../../firebase";
import "./note-sass/NotesInput.scss";
import NoteInputFontSelect from "./notes input selector/NoteInputFontSelect";
import NoteInputFontSizeSelect from "./notes input selector/NoteInputFontSizeSelect";
import NotesInputSelect from "./notes input selector/NotesInputColorSelect";
import Offline from "./sub-component/Offline";
import { v4 as uuidV4 } from "uuid";
import LoadingSvg from "./img/LoadingSvg";
import BackSvg from "./img/BackSvg";
import CryptoJS from "crypto-js";

export default function NotesInput() {
  const {
    setAddNote,
    text,
    setText,
    noteBackgroundColor,
    setNoteBackgroundColor,
    textColor,
    setTextColor,
    font,
    setFont,
    fontSize,
    setFontSize,
    title,
    setTitle,
    defaultTheme,
    setFadeOut,
    setOnlineStatus,
    onlineStatus
  } = useStateContext();

  const [noteHelp, setNoteHelp] = useState(false);
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();
  const id = uuidV4();

  // First Load
  useEffect(() => {
    document.querySelector("body").style.background = defaultTheme[0];
  }, [defaultTheme]);

  // First Load
  useEffect(() => {
    setNoteBackgroundColor(defaultTheme[1]);
    setTextColor(defaultTheme[2]);
  }, [defaultTheme, setNoteBackgroundColor, setTextColor]);

  // Ripples
  const handleRipples = (e) => {
    setNoteHelp(!noteHelp);
    let ripplesClassName = e.target.className;
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;
    let ripples = document.createElement("span");
    ripples.style.left = x + "px";
    ripples.style.top = y + "px";
    document.querySelector(`.${ripplesClassName}`).appendChild(ripples);
    setTimeout(() => {
      ripples.remove();
    }, 500);
  };

  // Document Update
  const handleUpdate = () => {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let date = new Date();
    let fullDate = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
    database.users
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let tempNote = doc.data().note;
          let decryptedNote = "";
          if (tempNote !== "") {
            decryptedNote = JSON.parse(
              CryptoJS.AES.decrypt(tempNote, doc.data().password).toString(
                CryptoJS.enc.Utf8
              )
            );
          }
          tempNote = [
            ...decryptedNote,
            {
              title: title,
              note: text,
              backgroundColor: noteBackgroundColor,
              textColor: textColor,
              font: font,
              fontSize: fontSize,
              noteId: id,
              date: fullDate,
            },
          ];
          let tempNoteEncrypted = CryptoJS.AES.encrypt(
            JSON.stringify(tempNote),
            doc.data().password
          ).toString();
          database.users
            .doc(currentUser.uid)
            .update({
              note: tempNoteEncrypted,
            })
            .then((e) => {
              setText("");
              setTitle("");
              setFont("Sans-serif");
              setFontSize("25");
              setNoteBackgroundColor(defaultTheme[1]);
              setTextColor(defaultTheme[2]);
              setSaving(false);
              setAddNote(false);
            });
        }
      });
  };

  // Note Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (navigator.onLine) {
      setFadeOut(false)
      setSaving(true);
      handleUpdate();
    }
    if (navigator.onLine === false) {
      setOnlineStatus(true);
      console.log("offline");
    }
  };

  // Close Add Note
  const handleClose = () => {
    setText("");
    setTitle("");
    setFont("Sans-serif");
    setFontSize("25");
    setNoteBackgroundColor(defaultTheme[1]);
    setTextColor(defaultTheme[2]);
    setFadeOut(false)
    document.querySelector(".formContainer").classList.add("close");
    setTimeout(() => {
      setAddNote(false);
    }, 300);
  };

  return (
    <div className="formContainer" style={{ background: defaultTheme[0] }}>
      {saving && <LoadingSvg />}
      {onlineStatus && <Offline />}
      <div
        className="navInput"
        style={{
          background: defaultTheme[1],
          color: defaultTheme[2],
          boxShadow: `0px 0px 0px ${defaultTheme[4]}`,
        }}
      >
        <button
          className="backInput"
          onClick={handleClose}
          style={{ background: defaultTheme[3] }}
        >
          <BackSvg />
        </button>
        <h1 style={{ color: defaultTheme[2] }}>Add Note</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputCon">
          <input
            className="titleInput"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Title..."
            maxLength="15"
            style={{
              background: `${noteBackgroundColor}`,
              color: `${textColor}`,
              transition: "all 0.35s",
              fontFamily: `${font}`,
              boxShadow: `0px 0px 0px ${defaultTheme[4]}`,
            }}
          />
          <div className="chaLimit" style={{ color: `${textColor}` }}>
            {title.length}/15
          </div>
        </div>
        <div className="textareaCon">
          <textarea
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            placeholder="Note..."
            maxLength="1000"
            style={{
              background: `${noteBackgroundColor}`,
              color: `${textColor}`,
              transition: "all 0.35s",
              fontFamily: `${font}`,
              fontSize: `${fontSize}px`,
              boxShadow: `0px 0px 0px ${defaultTheme[4]}`,
            }}
          />
          <div className="chaLimit" style={{ color: `${textColor}` }}>
            {text.length}/1000
          </div>
        </div>
        <div className="selectContainer">
          <NotesInputSelect
            title="Background"
            paddingT="0px"
            paddingB="0px"
            align_1="0"
            color={noteBackgroundColor}
            setColor={setNoteBackgroundColor}
            colors={["#ffffff",`${defaultTheme[1] === '#ffffff' ? "#f2cdaf" : `${defaultTheme[1]}`}`, "#f9e2cf", "#fcd9dd", "#b6dee7"]}
          />
          <NotesInputSelect
            title="Text Color"
            paddingT="10px"
            paddingB="0px"
            align_2="0"
            color={textColor}
            setColor={setTextColor}
            colors={["#000000", "#ffffff", "#ff0000", "#9500ff", "#ff00ff"]}
          />
          <NoteInputFontSelect />
          <NoteInputFontSizeSelect />
        </div>
        <button
          type="submit"
          className="save"
          style={{
            background: defaultTheme[5],
            boxShadow: `0px 0px 0px ${defaultTheme[4]}`,
          }}
          onClick={handleRipples}
        >
          Save
        </button>
      </form>
    </div>
  );
}
