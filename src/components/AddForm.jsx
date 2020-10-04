import React, { useState, useEffect } from "react";
import Title from "./Title";
import Card from "./Card";
import Tag from "./Tag";
import Axios from "axios";
import AuthSetvice from "./AuthSetvice";
import LoginPage from "./LoginPage";
import Footer from "./Footer";
import ErrValidator from "./Errvalidator";




function AddForm() {
      let [Token, setToken] = useState(false)
      async function Start() {
            let res = await AuthSetvice.CheckToken();
            if (res === 200) {
                  setToken(true)
            }
      }

      Start();
      
      const   [state, setState] = useState({
            selectedFile:[String],
            tag: "", 
            nick:""
      });
      let [array, setArray] = useState([])
      const [preview, setPreview] = useState(null);
      let [existingWorks, setExistingWorks] = useState({
            oldTag: "",
            array: [],
            show: false
      });

      useEffect(async () => {
            try {
            let data = await Axios.get("http://localhost:8080/api/db")
            console.log(data);
            data.data.map((element) => {
                  setArray((prev) => {
                        return [...prev, element.nick]
                  })
            });
      } catch(err) {
            console.error("Error while get info about users, " + err)
      }
      }, []);

      function   onChangeHandler(event){
            let files = event.target.files;
            setState((prev) => {
                  return {nick: prev.nick,
                  selectedFile: files,
                  tag: prev.tag
            }});
        }

      async function onChangeNick(event) {
            let text = event.target.value;
            text = text.toUpperCase();
            if (array.includes(text)) {
                  UppdateWorks(text);
            } else {
                  setExistingWorks({oldTag: "",
                  array: [],
                  show: false})
            }


            setState((prev)=>{
                  return {nick: text,
                  selectedFile: prev.selectedFile,
                  tag: prev.tag
            }});
      }

      function onChangeTag(event) {
            let file = event.target.files[0];
            setState((prev) => {
                  return {nick: prev.nick,
                  selectedFile: prev.selectedFile,
                  tag: file
            }});
            setPreview(URL.createObjectURL(file));
      }

      function  onClickHandler() {
            let data = new FormData();
            Array.prototype.forEach.call(state.selectedFile, (element)=>{
                  data.append("file", element);
            });
            data.append('nick', state.nick);
            data.append('tag', state.tag);
            data.append("token", JSON.parse(localStorage.getItem('user')))
            Axios.post("http://localhost:8080/upload", data
            ).then(res => { 
                  console.log(res.status);
                  UppdateWorks(state.nick);
               })
            }

            async function DeletePainter() {
                  if   ( window.confirm(`Are you sure?`)) {
                    try  {
                        let dataDelPainter = {'nick': state.nick,
                        "token": JSON.parse(localStorage.getItem('user'))
                  };
                        let res = await Axios.post("http://localhost:8080/DeletePainter", dataDelPainter);
                        console.log(res);
                  } catch (err) {
                        console.error(err)
                  }
                  UppdateWorks();
            }
            }

            async function DeleteWorks(event) {
                  console.log("here")
                  try {
                        let dataDelWork = {
                              'nick': state.nick,
                              "key": event.target.value,
                              "token": JSON.parse(localStorage.getItem('user'))
                        }
                        await Axios.post("http://localhost:8080/deleteWork", dataDelWork);
                  } catch (err) {
                        console.error(err)
                  }
                  UppdateWorks(state.nick);
            }

      async function UppdateWorks(text) {
            console.log(text);
            setExistingWorks({oldTag: "",
                  array: [],
                  show: false});
           if (text) {
                 try {
                  let res = await Axios.get("http://localhost:8080/api/painter/"+ text);
                  console.log(res)
                  let tag = res.data.tag.link;
                  setExistingWorks((prev) => {
                        return {
                              ...prev, 
                              oldTag: tag,
                              show: true
                        }
                  })
                  res.data.works.map((element) => {
                        setExistingWorks((prev) => {
                              return {...prev,
                                 array: [...prev.array, element]
                              }
                        })
                  })
            }  catch(err) {
                  console.log("Error receiving painter's work, " + err)
            } }
      }

      if (!Token) {
            return <LoginPage />
      } else if (Token) {
            return (<div>
                  <Title title="Add menu"/>
                  <div className="container">
                        <div className="AddForm">
                              <label for="text">Nickname</label>
                              <input type="text" className="InputText" onChange={onChangeNick} value={state.nick}/>
                              <label for="tag">Tag</label>
                              <input onChange={onChangeTag} type="file" id="tag" name="tag" calssName="InputFile" accept=".jpg, .jpeg, .png"/>
                              <label for="file">Works</label>
                              <input onChange={onChangeHandler} type="file" id="file" name="file" calssName="InputFile" accept=".jpg, .jpeg, .png" multiple/>
                              
                              <button className="styleBth" type="submit" onClick={onClickHandler}>Add</button>
                              <ErrValidator visibility={existingWorks.show} err="This painter alredy exist, but you can edit his profile if you like" />

                        </div>
                  </div>
                  <Title title="Preview"/>
                  <div className="preview">
                        <div className="container center bigCard">
                              <Card  name={state.nick.toUpperCase()}/>
                              <Tag oldTag={existingWorks.oldTag} tag={preview} />
                        </div>
                        <div className="container center">
                        {existingWorks.array.map((element)=> {
                              return <div className="WorkBlock">
                              <img className="painterWorks" src={element.link} />
                              <div className="DeleteItem">
                                    <button onClick={DeleteWorks} value={element.key} type="submit" name="key" className="DeleteBth">del</button>
                              </div>
            </div>
                        })}

                        </div>
                  </div>
            <div className="container center">
                  <button onClick={DeletePainter} className="styleBth center" style={existingWorks.show ? {visibility: "visible", display: "block"} : {visibility: "hidden", display: "none"}}>Delete painter</button>
            </div>
                  <Footer />   
            </div>)       
      }


      
}

export default AddForm;