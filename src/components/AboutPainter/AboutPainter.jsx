import React, { useState, useEffect } from "react";
import Axios from "axios";
import Card from "../Cards/Card";
import Tag from "../Cards/Tag"
import Title from "../Title/Title";
import Scroll from "react-scroll";

import "./style.css";



function AboutPainter(props) {
      let [nick, setNick] = useState("");
      let [tag, setTag] = useState({});
      let [works, setWorks] = useState([]);
      useEffect(() => {
            async function fetchData() {
                  try {
                        let res = await Axios.get("http://localhost:8080/api/painter/" + props.id);
                        if (res) {
                              setNick(res.data.nick);

                              if (res.data.tag != "") {
                                    setTag(res.data.tag.link);
                              }
                              setWorks(res.data.works);
                        }

                  } catch (err) {
                        console.error("Error while get req, " + err);
                  }
            }
            fetchData();
      }, []);

      let scroll = Scroll.animateScroll;

      return (<div>
            {scroll.scrollToTop({ duration: 0 })}
            <div className="container center bigCard">
                  <Card name={nick} />
                  <Tag tag={tag} />
            </div>
            <Title title="Works" color="orange" />
            <div className="container center">
                  {works.map((currentItem, key) => {
                        return <div key={key} className="WorkBlock">
                              <img className="painterWorks" src={currentItem.link} />
                        </div>
                  })}

            </div>


      </div>)
}

export default AboutPainter;