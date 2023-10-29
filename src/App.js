import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';
import '/node_modules/bootstrap/dist/css/bootstrap.css';
import './custom.scss';
import { useEffect, useState, useRef } from 'react';
export default function App() {
  const [A_value, setA] = useState(0);
  const [B_value, setB] = useState(0);
  const [name, setName] = useState(localStorage.getItem("name"));
  const [lvl, setLvl] = useState(0);
  const [highLvl, setHighLvl] = useState(0);
  const [rules, setRules] = useState("");
  const [mechanics, setMechanics] = useState("");
  const [rcounter, setRCount] = useState(0);
  const [mcounter, setMCount] = useState(0);
  const [urcounter, setURCount] = useState(0);
  const [umcounter, setUMCount] = useState(0);
  const [failed, setFail] = useState(false);
  const [brokenRule, setBrokenRule] = useState(0);
  const random1 = useRef(Math.floor(Math.random()*10)+1);
  const random2 = useRef(Math.floor(Math.random()*10)+1);
  const random3 = useRef(Math.floor(Math.random()*4)+2);
  const random4 = useRef(Math.floor(Math.random()*100)+100);
  const random5 = useRef(Math.floor(Math.random()*5)+3);
  const [minusA, setMinusA] = useState(-1);
  const [minusB, setMinusB] = useState(-1);
  const [plusA, setPlusA] = useState(1);
  const [plusB, setPlusB] = useState(1);
  const [timer, setTimer] = useState(30);
  useEffect(()=>{
    if (A_value < 0 || B_value < 0) {
      setBrokenRule(3);
      setFail(true);
    }
    if (rules.length >= 4) {
      if (A_value === B_value/2) {
        setBrokenRule(4);
        setFail(true);
      }
      if (rules.length >= 5 && (A_value === B_value && A_value !== 2)) {
        setBrokenRule(5);
        setFail(true);
      }
      if ((urcounter < 2 && rules.length >= 6) && (A_value + random1.current === B_value + random2.current)) {
        setBrokenRule(6);
        setFail(true);
      }
      if (urcounter >= 2 && (A_value + random2.current === B_value + random1.current)) {
        setBrokenRule(6);
        setFail(true);
      }
      if (rules.length >= 7 && (A_value + B_value**2) <= random4.current) {
        setBrokenRule(7);
        setFail(true);
      }
    }
    if (highLvl < Math.min(A_value, B_value)) {
      document.getElementById("lvl").className = "text-success col-12";
      setTimeout(()=>{
        document.getElementById("lvl").className = "text-light col-12";
        setLvl(Math.min(A_value, B_value));
      }, 500);
    }
    setLvl(Math.min(A_value, B_value));
  }, [A_value, B_value, rules, highLvl, urcounter]);
  useEffect(() => {
    if (highLvl < lvl && !failed) {
      setHighLvl(lvl);
    }
  }, [lvl, highLvl, failed]);
  useEffect(() => {
    if (highLvl !== 0) {
      (async function () {
        try {
          const changesFile = await fetch(`${process.env.PUBLIC_URL}/changes.txt`);
          const changesInfo = await changesFile.text();
          var changesContent = "";
          if (changesInfo.includes("\r")) {
            changesContent = changesInfo.split("\r\n");
          } else {
            changesContent = changesInfo.split("\n");
          }
          setRCount(0);
          setMCount(0);
          setURCount(0);
          setUMCount(0);
          for (let i = 0; i < highLvl; i++) {
            if (changesContent[i] === "R") {
              setRCount(r => r + 1);
            } else if (changesContent[i] === "M") {
              setMCount(m => m + 1);
            } else if (changesContent[i] === "UR") {
              setURCount(ur => ur + 1);
            } else if (changesContent[i] === "UM") {
              setUMCount(um => um + 1);
            }
          }
          console.log(highLvl, changesContent, changesContent[highLvl-1]);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [highLvl]);
  useEffect(()=>{
    if (umcounter >= 1) {
      if (minusA < 0) {
        setMinusA(-random3.current);
      } else {
        setPlusA(-random3.current);
      }
    }
    if (umcounter >= 2) {
      if (plusB > 0) {
        setPlusB(random3.current);
      } else {
        setMinusB(random3.current);
      }
    }
    if (umcounter >= 3) {
      if (plusA > 0) {
        setPlusA(random5.current);
      } else {
        setMinusA(random5.current);
      }
    }
  }, [umcounter, plusB, minusA, plusA]);
  useEffect(() => {
      (async function () {
        try {
          const mechanicFile = await fetch(`${process.env.PUBLIC_URL}/mechanics.txt`);
          const mechanicInfo = await mechanicFile.text();
          var mechanicContent = "";
          if (mechanicInfo.includes("\r")) {
            mechanicContent = mechanicInfo.split("\r\n");
          } else {
            mechanicContent = mechanicInfo.split("\n");
          }
          const updatedMechanicFile = await fetch(`${process.env.PUBLIC_URL}/updatedmechanics.txt`);
          const updatedMechanicInfo = await updatedMechanicFile.text();
          var updatedMechanicContent = "";
          if (updatedMechanicInfo.includes("\r")) {
            updatedMechanicContent = updatedMechanicInfo.split("\r\n");
          } else {
            updatedMechanicContent = updatedMechanicInfo.split("\n");
          }
          updatedMechanicContent = updatedMechanicContent.splice(0, umcounter);
          var updatedMechanicsList = {};
          for (let i=0; i<updatedMechanicContent.length; i++) {
            updatedMechanicsList[updatedMechanicContent[i].charAt(0)] = updatedMechanicContent[i];
          }
          var mechanicList = [];
          var count = 0;
          for (let i = 0; i < 5 + mcounter; i++) {
            if (i < mechanicContent.length) {
              mechanicList.push(
                <tr className={!failed && ((mcounter > 0 && i === 4+mcounter) || (i+1) in updatedMechanicsList) ? "mech table-success" : "mech table-primary"} key={`mechanic-${i}`}>
                  <td>
                    <strong>Mechanic {i + 1} - </strong>
                    {count < umcounter && (i+1) in updatedMechanicsList ? updatedMechanicsList[i+1].substring(2).replace("(R3)", random3.current).replace("(R5)", random5.current) : mechanicContent[i]}
                  </td>
                </tr>
              );
              if ((i+1) in updatedMechanicsList) {
                count++;
              }
            }
          }
          setMechanics(mechanicList);
          setTimeout(()=>{
            if (document.getElementsByClassName("mech table-success").length !== 0) {
              document.getElementsByClassName("mech table-success")[0].className = "mech table-primary";
            }
          }, 500);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [highLvl, mcounter, umcounter, failed]);
  useEffect(() => {
      (async function () {
        try {
          const ruleFile = await fetch(`${process.env.PUBLIC_URL}/rules.txt`);
          const ruleInfo = await ruleFile.text();
          var ruleContent = "";
          if (ruleInfo.includes("\r")) {
            ruleContent = ruleInfo.split("\r\n");
          } else {
            ruleContent = ruleInfo.split("\n");
          }  
          const updatedRuleFile = await fetch(`${process.env.PUBLIC_URL}/updatedrules.txt`);
          const updatedRuleInfo = await updatedRuleFile.text();
          var updatedRuleContent = "";
          if (updatedRuleInfo.includes("\r")) {
            updatedRuleContent = updatedRuleInfo.split("\r\n");
          } else {
            updatedRuleContent = updatedRuleInfo.split("\n");
          }
          updatedRuleContent = updatedRuleContent.splice(0, urcounter);
          var updatedRulesList = {};
          for (let i=0; i<updatedRuleContent.length; i++) {
            updatedRulesList[updatedRuleContent[i].charAt(0)] = updatedRuleContent[i];
          }
          var ruleList = [];
          var count = 0;
          for (let i = 0; i < 3 + rcounter; i++) {
            if (i < ruleContent.length) {
              ruleList.push(
                <tr className={!failed && ((rcounter > 0 && i === 2+rcounter) || (i+1) in updatedRulesList) ? "rule table-success" : "rule table-secondary"} key={`rule-${i}`}>
                  <td>
                    <strong>Rule {i + 1} - </strong>
                    {count < urcounter && (i+1) in updatedRulesList ? updatedRulesList[i+1].substring(2).replace("(R1)", random1.current).replace("(R2)", random2.current).replace("(R4)", random4.current) : ruleContent[i].replace("(R1)", random1.current).replace("(R2)", random2.current).replace("(R4)", random4.current)}
                  </td>
                </tr>
              );
              if ((i+1) in updatedRulesList) {
                count++;
              }
            }
          }
          setRules(ruleList);
          setTimeout(()=>{
            if (document.getElementsByClassName("rule table-success").length !== 0) {
              document.getElementsByClassName("rule table-success")[0].className = "rule table-secondary";
            }
          }, 500);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [highLvl, rcounter, urcounter, failed]);
  function click(btn, num) {
    if (btn === "A") {
      setA(x => x + num);
      if (mcounter >= 1) {
       var temp2 =  document.getElementById("btnA1").innerHTML;
       document.getElementById("btnA1").innerHTML = document.getElementById("btnA2").innerHTML;
       document.getElementById("btnA2").innerHTML = temp2;
       temp2 = minusA;
       setMinusA(plusA);
       setPlusA(temp2);
      }
    } else {
      setB(x => x + num);
      if (mcounter >= 1) {
       var temp =  document.getElementById("btnB1").innerHTML;
       document.getElementById("btnB1").innerHTML = document.getElementById("btnB2").innerHTML;
       document.getElementById("btnB2").innerHTML = temp;
       temp = minusB;
       setMinusB(plusB);
       setPlusB(temp);
      }
    }
  }
  function swap() {
    var temp3 = A_value;
    setA(B_value);
    setB(temp3);
  }
  return (
    <div className="vh-100 vw-100 d-flex m-auto p-auto align-items-center justify-content-center bg-dark ">
      <div id="input" className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-dark">
        <div className="rounded bg-dark border border-light border-10 text-center justify-content-center p-4 col-sm-10 col-md-6">
          <h1 className="text-light">{localStorage.getItem("name") === null ? "What is your username?" : `Hi! You may put in a different username or just submit your previous one.`}</h1>
          <input id="name" className="rounded col-6 border p-2 m-2 text-center" type="text" defaultValue={localStorage.getItem("name")} onChange={() => setName(document.getElementById("name").value)} />
          <br></br>
          <button className="btn btn-light m-2 p-1 col-4 bg-light" onClick={()=>document.getElementById("input").remove()}>Confirm</button>
        </div>
      </div>
      {failed &&
        <div id="input" className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-dark">
          <div className="m-auto p-2 rounded bg-dark border border-light border-10 text-center justify-content-center col-sm-10 col-md-6">
              <h1 className="text-light">You broke rule {brokenRule}. Oof.</h1>
              <p className="text-light">On the bright side, you managed to reach level {highLvl}. During your time, the Number Game had these mechanics and rules.</p>
              <div className="row">
                <div className="col-6 row d-flex flex-column align-items-center my-3 mx-auto">
                  <table className="table table-striped table-primary rounded table-bordered">
                    <thead>
                      <tr>
                        <th>Mechanics</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mechanics}
                    </tbody>
                  </table>
                </div>
                <div className="col-6 row d-flex flex-column align-items-center my-3 mx-auto">
                  <table className="table table-striped table-secondary rounded table-bordered">
                    <thead>
                      <tr>
                        <th>Rules</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
      }
      <div className="h-100 w-100 row">
        <div className="pt-5 m-auto bg-dark d-flex row text-center justify-content-center">
          <h1 id="lvl" className="text-light col-12">Level {lvl}</h1>
          <h1 className="text-primary col-6 m-auto">A</h1>
          <h1 className="text-secondary col-6 m-auto">B</h1>
          <div className="col-5 row align-items-center m-auto">
            <button id="btnA1" className="btn btn-primary col-4" onClick={()=>click("A", minusA)}>-</button>
            <h1 className="text-primary col-4 p-1 m-0">{A_value}</h1>
            <button id="btnA2" className="btn btn-primary col-4" onClick={()=>click("A", plusA)}>+</button>
          </div>
          <div className="col-5 row align-items-center m-auto">
            <button id="btnB1" className="btn btn-secondary col-4" onClick={()=>click("B", minusB)}>-</button>
            <h1 className="text-secondary col-4 p-1 m-0">{B_value}</h1>
            <button id="btnB2" className="btn btn-secondary col-4" onClick={()=>click("B", plusB)}>+</button>
          </div>
          {mcounter >= 3 ? <h3 className="text-light col-12">{timer}</h3>: ""}
          {mcounter >= 2 ? <button className="btn btn-light text-center col-6 mt-3" onClick={()=>swap()}>Switch ⇆</button> : ""}
          <div className="row">
            <div className="col-6 row d-flex flex-column align-items-center my-3 mx-auto">
              <table className="table table-striped table-primary rounded table-bordered">
                <thead>
                  <tr>
                    <th>Mechanics</th>
                  </tr>
                </thead>
                <tbody>
                  {mechanics}
                </tbody>
              </table>
            </div>
            <div className="col-6 row d-flex flex-column align-items-center my-3 mx-auto">
              <table className="table table-striped table-secondary rounded table-bordered">
                <thead>
                  <tr>
                    <th>Rules</th>
                  </tr>
                </thead>
                <tbody>
                  {rules}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
