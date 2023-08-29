import userContext from "../context/userContext"
import Base from "../components/Base"

const About = () => {
  return (
    <userContext.Consumer>
      {(object) => (
        <Base>
          <h1>
            The purpose of the EdTech Articles and Coding Compiler Platform is
            to create a comprehensive and interactive web-based application that
            caters to the needs of software enthusiasts, developers, and
            learners. The platform offers a space for users to share their
            expertise through blogs, discuss interview experiences, and practice
            coding problems using an integrated coding compiler. By offering
            these features, the platform aims to foster knowledge sharing,
            collaboration, and skill development within the software community
          </h1>
          <p>we are building EdTech website</p>
          {console.log(object)}
          <h1>Welcome user: {object.user.login && object.user.data.name}</h1>
        </Base>
      )}
    </userContext.Consumer>
  )
}

export default About
