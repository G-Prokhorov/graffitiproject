import React, { useState, useEffect} from "react"
import Title from "./Title"
import Card from "./Card"
import Tag from "./Tag"
import Axios from "axios"

function AddForm() {
      const   [state, setState] = useState({
            selectedFile:[String],
            tag: "", 
            nick:""
      });
      const [preview, setPreview] = useState(null);

      function   onChangeHandler(event){
            let files = event.target.files;
            setState((prev) => {
                  return {nick: prev.nick,
                  selectedFile: files,
                  tag: prev.tag
            }});
        }
      
      function onChangeNick(event) {
            let text = event.target.value;
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
            const data = new FormData();
            Array.prototype.forEach.call(state.selectedFile, (element)=>{
                  console.log(element)
                  data.append("file", element);
            });
            data.append('nick', state.nick);
            data.append('tag', state.tag);
            console.log(data)
            Axios.post("http://localhost:8080/upload", data,  { 
            
            }).then(res => { // then print response status
                  console.log(res.statusText)
               })
            }

     console.log(state)

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

                  </div>
            </div>
            <Title title="Preview"/>
            <div className="preview">
                  <div className="container center bigCard">
                        <Card  name={state.nick.toUpperCase()}/>
                        <Tag  tag={preview} />
                        </div>
            </div>      
      </div>
      )
}

export default AddForm;