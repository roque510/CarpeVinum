import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { Link } from "react-router-dom";

import CreateTastingSession from "./Form/CreateTastingSession";

import CREATE_TASTING_SESSION from "../../graphql/mutations/CREATE_TASTING_SESSION";
import LOCAL_TASTING_SESSION from "../../graphql/queries/LOCAL_TASTING_SESSION";

class Home extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <Mutation
          variables={{}}
          onCompleted={() => {
            this.setState({
              isOpen: true,
            });
          }}
          mutation={CREATE_TASTING_SESSION}
          update={(cache, { data }) => {
            const localData = cache.readQuery({ query: LOCAL_TASTING_SESSION });
            cache.writeQuery({
              query: LOCAL_TASTING_SESSION,
              data: { ...localData, sessionID: data.createTastingSession.id },
            });
          }}
        >
              {postMutation => (
              <div className="d-inline-flex p-2 bd-highlight" >
                <div className="card" style={{width: "18rem"}}>
                  <img src="/assets/img/tastesession.png" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Create New</h5>
                    <p className="card-text">Tasting Session</p>
                    <Link to="tastingSession" className="btn btn-primary" onClick={isOpen ? null : postMutation} >Start</Link>
                  </div>
                </div>                
            </div>
                )}
        </Mutation>        
      </React.Fragment>
    );
  }
}

export default Home;
