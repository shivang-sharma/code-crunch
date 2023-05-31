import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import "./ProblemsPage.css";
import { backendUrl } from "../../constants.js";
import { socket } from "../../lib/socket";

const ProblemsPage = () => {
  const [CodeSeg, setCodeSeg] = useState("");
  const { pid } = useParams();
  const cleanId = pid.substring(1);
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const init = async () => {
    const response = await fetch(`${backendUrl}/problem/` + cleanId, {
      method: "GET",
    });

    const json = await response.json();
    setProblem(json.problem);
  };

  useEffect(() => {
    init();
  }, []);
  // console.log(cleanId) ;

  const handleKey = (event) => {
    if (event.key == "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd, value } = event.target;
      const val =
        value.substring(0, selectionStart) +
        "\t" +
        value.substring(selectionStart);
      event.target.value = val;
      event.target.selectionStart = event.target.selectionEnd =
        selectionStart + 1;
    }
    setCodeSeg(event.value);
  };
  const onSubmit = () => {
    console.log("button clicked");
    setShowLoader(true);
    setTimeout(() => setShowLoader(false), 10000);
  };
  return (
    <div>
      {problem ? (
        <div id="problempage" className="flex-row">
          <div className="ques">
            <h1>{problem.title}</h1>
            <h5>Description</h5>
            <p>{problem.description}</p>
            <code>Input : {problem.exampleIn}</code>
            <code>Output : {problem.exampleOut}</code>
          </div>
          <div className="code">
            <h1>Code Here</h1>
            <div className="code-form">
              <textarea
                onChange={(e) => setSubmission(e.target.value)}
                name="SolvedCode"
                onKeyDown={(event) => handleKey(event)}
              ></textarea>
              <Button
                text="SubmitCode"
                onSubmit={async () => {
                  setShowLoader(true);
                  const response = await fetch(`${backendUrl}/submission`, {
                    method: "POST",
                    headers: {
                      authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                      problemId: cleanId,
                      submission: submission,
                    }),
                  });
                  const json = await response.json();
                  console.log(json);
                  socket.emit("watch", "1021", "P101", (response) => {
                    console.log(response);
                    setShowLoader(false);
                  });
                }}
                loading={showLoader}
                disabled={showLoader}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>The searched Question Doesn't exist</div>
      )}
    </div>
  );
};

export default ProblemsPage;
