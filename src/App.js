import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';
import '/node_modules/bootstrap/dist/css/bootstrap.css';
import './custom.scss';
import axios from 'axios';
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
  const [failed, setFail] = useState(false);
  const [brokenRule, setBrokenRule] = useState(0);
  const random1 = useRef(Math.floor(Math.random()*200)+20);
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
      if (rules.length >= 6 && ((A_value * B_value) >= random1.current)) {
        setBrokenRule(6);
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
  }, [A_value, B_value, rules, highLvl]);
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
          if (changesContent[highLvl-1] === "R") {
            setRCount(r => r + 1);
          } else if (changesContent[highLvl-1] === "M") {
            setMCount(m => m + 1);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [highLvl]);
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
          var mechanicList = [];
          for (let i = 0; i < 5 + mcounter; i++) {
            if (i < mechanicContent.length) {
              mechanicList.push(
                <tr key={`mechanic-${i}`}>
                  <td>
                    <strong>Mechanic {i + 1} - </strong>
                    {mechanicContent[i]}
                  </td>
                </tr>
              );
            }
          }
          setMechanics(mechanicList);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [highLvl, mcounter]);

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
          var ruleList = [];
          for (let i = 0; i < 3 + rcounter; i++) {
            if (i < ruleContent.length) {
              ruleList.push(
                <tr key={`rule-${i}`}>
                  <td>
                    <strong>Rule {i + 1} - </strong>
                    {i === 5 ? ruleContent[i].replace("(R)", random1.current): ruleContent[i]}
                  </td>
                </tr>
              );
            }
          }
          setRules(ruleList);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [highLvl, rcounter]);
  /** 
    axios.post('https://sheet.best/api/sheets/200fed7a-fde4-4c8e-8e11-4f64431fb939', {
      name, A_value, B_value, lvl
    });
    localStorage.setItem("name", name);
  }
  */
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
          <div className="rounded bg-dark border border-light border-10 text-center justify-content-center p-4 col-sm-10 col-md-6">
              <h1 className="text-light">You broke rule {brokenRule}. Oof.</h1>
              <p className="text-light">On the bright side, you managed to reach level {highLvl}. During your time, the Number Game had these mechanics and rules.</p>
              <div className="row">
                <div className="col-6 row d-flex flex-column align-items-center my-3 mx-auto">
                  <table className="table table-striped table-light rounded table-bordered">
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
                  <table className="table table-striped table-light rounded table-bordered">
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
            <button className="btn btn-primary col-4" onClick={()=>setA(x => x-1)}>-</button>
            <h1 className="text-primary col-4 p-1 m-0">{A_value}</h1>
            <button className="btn btn-primary col-4" onClick={()=>setA(x => x+1)}>+</button>
          </div>
          <div className="col-5 row align-items-center m-auto">
            <button className="btn btn-secondary col-4" onClick={()=>setB(x => x-1)}>-</button>
            <h1 className="text-secondary col-4 p-1 m-0">{B_value}</h1>
            <button className="btn btn-secondary col-4" onClick={()=>setB(x => x+1)}>+</button>
          </div>
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
