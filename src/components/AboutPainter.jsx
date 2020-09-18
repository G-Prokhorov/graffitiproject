import React, {useState, useEffect} from "react";
import Axios from "axios";
import Card from "./Card";
import Tag from "./Tag"
import Title from "./Title";
import Scroll from "react-scroll";



function AboutPainter(props) {
      let [nick, setNick ] = useState("")
      let [tag, setTag] = useState({});
      let [works, setWorks] = useState([]);
      useEffect( async () => {
      try {      let res = await Axios.get("http://localhost:8080/api/painter/"+ props.id);
            setNick(res.data.nick)
            setTag(res.data.tag.link);
            setWorks(res.data.works);
      } catch (err) {
            console.error("Error wjile get req, " + err)
      }
      }, []);
      
      let scroll = Scroll.animateScroll;

      async function DeletePainter() {
            if   ( window.confirm(`Are you sure?`)) {
              try  {
                  let res = await   Axios.post("http://localhost:8080/DeletePainter", {
                        nick: nick
                  });
                  console.log(res);
            } catch (err) {
                  console.error(err)
            }
           
      }
      }

      
    return  (<div>
    {scroll.scrollToTop({duration: 0})}
    <div className="container center bigCard">
            <Card  name={nick}/>
            <Tag tag={tag} />
            </div>
            <Title title="Works"/>
            <div className="container center">
            {works.map((currentItem)=>{
                  return <div className="WorkBlock"> 
                  <img className="painterWorks" src={currentItem.link}/>
                  <form className="DeleteItem" action={"http://localhost:8080/deleteWork/"+nick} method="POST">
                 <button type="submit" name="key" value={currentItem.key} className="DeleteBth">del</button>
                 </form>
                  </div>
            })}
             
            </div>
      
      <div className="container center">
            <button className="styleBth" onClick={DeletePainter}>Delete all</button>
      </div>

      </div>)
}

export default AboutPainter;