import React, { Component } from "react"
//import { Buffer } from "buffer"
import { decode as base64_decode, encode as base64_encode } from "base-64"

import "./Compiler.css"
import { Link } from "react-router-dom"
export default class Compiler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: localStorage.getItem("input") || ``,
      output: ``,
      language_id: localStorage.getItem("language_Id") || 2,
      user_input: ``,
      userName: ``,
    }
  }

  componentDidMount() {
    // Retrieve the data from localStorage
    const storedData = localStorage.getItem("data")

    // Parse the stored JSON data
    const parsedData = JSON.parse(storedData)

    // Access the 'name' field from the 'user' object
    const name = parsedData?.user?.name || "user"

    this.setState({ userName: name }, () => {
      console.log("Updated userName:", this.state.userName)
    })
  }

  input = (event) => {
    event.preventDefault()

    this.setState({ input: event.target.value })
    localStorage.setItem("input", event.target.value)
  }
  userInput = (event) => {
    event.preventDefault()
    this.setState({ user_input: event.target.value })
  }
  language = (event) => {
    event.preventDefault()

    this.setState({ language_id: event.target.value })
    localStorage.setItem("language_Id", event.target.value)
  }

  submit = async (e) => {
    e.preventDefault()

    let outputText = document.getElementById("output")
    outputText.innerHTML = ""
    outputText.innerHTML += "Creating Submission ...\n"
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key":
            "a5d4bb009cmsh85b0c91a6bf9601p1e7b52jsn6b3ecc68eb75", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          // source_code: this.state.input,
          // stdin: this.state.user_input,
          source_code: base64_encode(this.state.input),
          stdin: base64_encode(this.state.user_input),
          language_id: this.state.language_id,
        }),
      }
    )
    outputText.innerHTML += "Submission Created ...\n"
    const jsonResponse = await response.json()

    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    }

    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`
      console.log(jsonResponse.token)
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true&fields=*`

        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key":
              "a5d4bb009cmsh85b0c91a6bf9601p1e7b52jsn6b3ecc68eb75", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
          },
        })

        jsonGetSolution = await getSolution.json()
      }
    } //Buffer.from(data, 'base64') instead.
    if (jsonGetSolution.stdout) {
      const output = base64_decode(jsonGetSolution.stdout)

      outputText.innerHTML = ""

      outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
    } else if (jsonGetSolution.stderr) {
      const error = base64_decode(jsonGetSolution.stderr)

      outputText.innerHTML = ""

      outputText.innerHTML += `\n Error :${error}`
    } else {
      const compilation_error = base64_decode(jsonGetSolution.compile_output)

      outputText.innerHTML = ""

      outputText.innerHTML += `\n Error :${compilation_error}`
    }
  }
  render() {
    const user = this.state.userName + " input" || "user input"
    return (
      <>
        <div className="row container-fluid">
          <div className="col-6 ml-4 ">
            <label htmlFor="solution ">
              <span className="badge badge-info heading mt-2 ">
                <i className="fas fa-code fa-fw fa-lg"></i> Code Here
              </span>
            </label>
            <textarea
              required
              name="solution"
              id="source"
              onChange={this.input}
              className=" source"
              value={this.state.input}
            ></textarea>

            <button
              type="submit"
              className="btn btn-danger ml-2 mr-2 "
              onClick={this.submit}
            >
              <i className="fas fa-cog fa-fw"></i> Run
            </button>

            <label htmlFor="tags" className="mr-1">
              <b className="heading">Language:</b>
            </label>
            <select
              value={this.state.language_id}
              onChange={this.language}
              id="tags"
              className="form-control form-inline mb-2 language"
            >
              <option value="54">C++</option>
              <option value="52">C</option>
              <option value="62">Java</option>
              <option value="71">Python</option>
              <option value="91">Java (JDK 17.0.6)</option>
              <option value="93">JavaScript (Node.js 18.15.0)</option>
            </select>
          </div>
          <div className="col-5">
            <div>
              <span className="badge badge-info heading my-2 ">
                <i className="fas fa-exclamation fa-fw fa-md"></i> Output
              </span>
              <textarea id="output"></textarea>
            </div>
          </div>
        </div>

        <div className="mt-2 ml-5">
          <span className="badge badge-primary heading my-2 ">
            <i className="fas fa-user fa-fw fa-md"></i>
            {user}
          </span>
          <br />
          <textarea id="input" onChange={this.userInput}></textarea>
        </div>
        <div>
          <Link className="btn btn-success" to={"/"}>
            Back To new Feed
          </Link>
        </div>
      </>
    )
  }
}
